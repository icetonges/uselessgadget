#!/usr/bin/env node
/**
 * generate-audio.mjs — one-time (and incremental) studio narration for the audiobook.
 *
 * Turns every paragraph of the story (app/audiobook/book-data.js) into a real-voice
 * MP3 using ElevenLabs or OpenAI TTS, plus a manifest.json the player reads at runtime.
 * Paragraph-level files keep the read-along highlight and click-to-jump working exactly
 * as they do with browser TTS.
 *
 * USAGE (run on your own machine, never in the browser — keys stay local):
 *
 *   ElevenLabs (best quality, ~40k chars for the whole book):
 *     ELEVENLABS_API_KEY=sk_...  node scripts/generate-audio.mjs --provider elevenlabs
 *     # optional: --voice <voiceId>   (default: "JBFqnCBsd6RMkjVDRZzb" — "George", warm narrator)
 *     # optional: --model <modelId>   (default: "eleven_multilingual_v2")
 *
 *   OpenAI TTS (strong + cheap alternative, whole book well under $1):
 *     OPENAI_API_KEY=sk-...  node scripts/generate-audio.mjs --provider openai
 *     # optional: --voice <name>      (default: "onyx"; also try "ash", "echo", "alloy")
 *     # optional: --model <modelId>   (default: "tts-1"; "tts-1-hd" for higher fidelity)
 *
 * Incremental: each paragraph's text is hashed. Re-running only regenerates paragraphs
 * whose text changed (or that are missing). Safe to re-run after editing the story.
 *
 * Output: public/audio/u000.mp3 ... + public/audio/manifest.json
 * Commit the output folder; Vercel serves it as static, CDN-cached files.
 */

import { createHash } from "node:crypto";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "audio");
const MANIFEST = join(OUT_DIR, "manifest.json");

/* ---------- CLI ---------- */
const args = process.argv.slice(2);
function flag(name, dflt) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
}
const provider = flag("provider", process.env.ELEVENLABS_API_KEY ? "elevenlabs" : "openai");

const CONFIG = {
  elevenlabs: {
    key: process.env.ELEVENLABS_API_KEY,
    keyName: "ELEVENLABS_API_KEY",
    voice: flag("voice", "JBFqnCBsd6RMkjVDRZzb"), // "George" — warm storyteller
    model: flag("model", "eleven_multilingual_v2"),
    label: "ElevenLabs",
  },
  openai: {
    key: process.env.OPENAI_API_KEY,
    keyName: "OPENAI_API_KEY",
    voice: flag("voice", "onyx"),
    model: flag("model", "tts-1"),
    label: "OpenAI TTS",
  },
}[provider];

if (!CONFIG) {
  console.error(`Unknown provider "${provider}". Use --provider elevenlabs | openai`);
  process.exit(1);
}
if (!CONFIG.key) {
  console.error(`Missing ${CONFIG.keyName} environment variable.`);
  process.exit(1);
}

/* ---------- Load story & flatten in EXACTLY the player's order ---------- */
// book-data.js uses ESM `export` but the repo isn't "type":"module", so import it
// through a data: URL — works on any Node >= 18 regardless of package.json type.
const bookSource = readFileSync(join(ROOT, "app", "audiobook", "book-data.js"), "utf8");
const { BOOK } = await import(
  `data:text/javascript;base64,${Buffer.from(bookSource).toString("base64")}`
);

const units = []; // { chapter, text }
BOOK.forEach((ch, ci) => {
  ch.paras.forEach((p) => {
    if (typeof p === "object" && p.list) {
      p.list.forEach((item) => units.push({ chapter: ci, text: item }));
    } else {
      units.push({ chapter: ci, text: p });
    }
  });
});

const hash = (t) => createHash("sha1").update(t).digest("hex").slice(0, 12);

/* ---------- Providers ---------- */
async function ttsElevenLabs(text) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${CONFIG.voice}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": CONFIG.key, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: CONFIG.model,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.35 },
      }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function ttsOpenAI(text) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${CONFIG.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: CONFIG.model,
      voice: CONFIG.voice,
      input: text,
      response_format: "mp3",
      speed: 1.0,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

const tts = provider === "elevenlabs" ? ttsElevenLabs : ttsOpenAI;

/* ---------- Generate (incremental, resumable) ---------- */
mkdirSync(OUT_DIR, { recursive: true });
let prev = { units: [] };
if (existsSync(MANIFEST)) {
  try {
    prev = JSON.parse(readFileSync(MANIFEST, "utf8"));
  } catch {
    /* regenerate all */
  }
}

const totalChars = units.reduce((n, u) => n + u.text.length, 0);
console.log(`Provider: ${CONFIG.label} | voice: ${CONFIG.voice} | model: ${CONFIG.model}`);
console.log(`Units: ${units.length} paragraphs | ~${totalChars.toLocaleString()} characters\n`);

const manifestUnits = [];
let made = 0,
  skipped = 0,
  failed = 0;

for (let i = 0; i < units.length; i++) {
  const file = `u${String(i).padStart(3, "0")}.mp3`;
  const h = hash(`${provider}|${CONFIG.voice}|${CONFIG.model}|${units[i].text}`);
  const prevUnit = prev.units?.[i];
  const upToDate = prevUnit && prevUnit.hash === h && existsSync(join(OUT_DIR, file));

  if (upToDate) {
    skipped++;
    manifestUnits.push({ file, hash: h });
    continue;
  }

  process.stdout.write(`[${i + 1}/${units.length}] ${units[i].text.slice(0, 56)}... `);
  try {
    const buf = await tts(units[i].text);
    writeFileSync(join(OUT_DIR, file), buf);
    manifestUnits.push({ file, hash: h });
    made++;
    console.log(`ok (${(buf.length / 1024).toFixed(0)} KB)`);
    await new Promise((r) => setTimeout(r, provider === "elevenlabs" ? 350 : 120)); // be polite to rate limits
  } catch (e) {
    failed++;
    manifestUnits.push(null); // hole — player will fall back to browser TTS until fixed
    console.log(`FAILED: ${e.message.slice(0, 140)}`);
  }
}

if (failed === 0) {
  writeFileSync(
    MANIFEST,
    JSON.stringify(
      {
        provider,
        voice: CONFIG.voice,
        model: CONFIG.model,
        generatedAt: new Date().toISOString(),
        count: manifestUnits.length,
        units: manifestUnits,
      },
      null,
      2
    )
  );
  console.log(`\nDone. ${made} generated, ${skipped} unchanged. Manifest written.`);
  console.log(`Commit public/audio/ and deploy — the player switches to studio narration automatically.`);
} else {
  console.error(`\n${failed} paragraph(s) failed — manifest NOT written (player stays on browser TTS).`);
  console.error(`Fix the error (often rate limit or quota) and re-run; completed files are kept.`);
  process.exit(1);
}
