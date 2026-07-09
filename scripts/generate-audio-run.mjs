#!/usr/bin/env node
/**
 * generate-audio-run.mjs — sandbox-safe runner copy of generate-audio.mjs.
 * (Kept as a separate file only because this dev sandbox had a stale mount
 * view of the original generate-audio.mjs; safe to delete once confirmed
 * the original script works fine on your own machine. Logic is identical.)
 */

import { createHash } from "node:crypto";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
function flag(name, dflt) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
}
const lang = flag("lang", "en") === "zh" ? "zh" : "en";
const provider = flag("provider", process.env.ELEVENLABS_API_KEY ? "elevenlabs" : "openai");

const LANG = {
  en: {
    dataFile: flag("datafile", "book-data.js"),
    exportName: "BOOK",
    outDir: join(ROOT, "public", "audio"),
  },
  zh: {
    dataFile: flag("datafile", "book-data.zh.js"),
    exportName: "BOOK_ZH",
    outDir: join(ROOT, "public", "audio", "zh"),
  },
}[lang];

const OUT_DIR = LANG.outDir;
const MANIFEST = join(OUT_DIR, "manifest.json");

const CONFIG = {
  elevenlabs: {
    key: process.env.ELEVENLABS_API_KEY,
    keyName: "ELEVENLABS_API_KEY",
    voice: flag("voice", "JBFqnCBsd6RMkjVDRZzb"),
    model: flag("model", "eleven_multilingual_v2"),
    label: "ElevenLabs",
  },
  openai: {
    key: process.env.OPENAI_API_KEY,
    keyName: "OPENAI_API_KEY",
    voice: flag("voice", lang === "zh" ? "nova" : "onyx"),
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

const bookSource = readFileSync(join(ROOT, "app", "audiobook", LANG.dataFile), "utf8");
const mod = await import(`data:text/javascript;base64,${Buffer.from(bookSource).toString("base64")}`);
const BOOK = mod[LANG.exportName];

const units = [];
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

mkdirSync(OUT_DIR, { recursive: true });
let prev = { units: [] };
if (existsSync(MANIFEST)) {
  try {
    prev = JSON.parse(readFileSync(MANIFEST, "utf8"));
  } catch {}
}

const totalChars = units.reduce((n, u) => n + u.text.length, 0);
console.log(`Language: ${lang} | Provider: ${CONFIG.label} | voice: ${CONFIG.voice} | model: ${CONFIG.model}`);
console.log(`Units: ${units.length} paragraphs | ~${totalChars.toLocaleString()} characters`);
console.log(`Output: ${OUT_DIR}\n`);

const manifestUnits = [];
let made = 0,
  skipped = 0,
  failed = 0;

for (let i = 0; i < units.length; i++) {
  const file = `u${String(i).padStart(3, "0")}.mp3`;
  const h = hash(`${lang}|${provider}|${CONFIG.voice}|${CONFIG.model}|${units[i].text}`);
  const prevUnit = prev.units?.[i];
  const upToDate = prevUnit && prevUnit.hash === h && existsSync(join(OUT_DIR, file));

  if (upToDate) {
    skipped++;
    manifestUnits.push({ file, hash: h });
    continue;
  }

  process.stdout.write(`[${i + 1}/${units.length}] ${units[i].text.slice(0, 40)}... `);
  try {
    const buf = await tts(units[i].text);
    writeFileSync(join(OUT_DIR, file), buf);
    manifestUnits.push({ file, hash: h });
    made++;
    console.log(`ok (${(buf.length / 1024).toFixed(0)} KB)`);
    await new Promise((r) => setTimeout(r, provider === "elevenlabs" ? 350 : 120));
  } catch (e) {
    failed++;
    manifestUnits.push(null);
    console.log(`FAILED: ${e.message.slice(0, 140)}`);
  }
}

if (failed === 0) {
  writeFileSync(
    MANIFEST,
    JSON.stringify(
      {
        lang,
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
  console.log(`\nDone. ${made} generated, ${skipped} unchanged. Manifest written to ${MANIFEST}.`);
} else {
  console.error(`\n${failed} paragraph(s) failed — manifest NOT written.`);
  console.error(`Fix the error and re-run; completed files are kept.`);
  process.exit(1);
}
