"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const AUDIOBOOK_CSS = `
.abk-root{
  --ink:#0e1420;
  --panel:#151d2e;
  --panel2:#1b2540;
  --paper:#e8ecf4;
  --dim:#8b98b3;
  --amber:#ffb454;
  --amber-deep:#e08a1e;
  --radio:#59d3a2;
  --line:#2a3554;
  background:var(--ink);
  color:var(--paper);
  font-family:'Source Serif 4', Georgia, serif;
  min-height:100vh;
}
.abk-root *{box-sizing:border-box}
.abk-root .wrap{max-width:860px;margin:0 auto;padding:28px 20px 220px}
@media (min-width:900px){
  .abk-root .wrap{max-width:1180px;padding:28px 24px 60px;margin-left:356px;margin-right:24px}
}

/* ---------- desktop layout: fixed left nav rail (audio + chapters), header/reader
   both stay full-width so the reading pane matches the header above it ---------- */
.abk-root .layout{margin-top:22px}
@media (min-width:900px){
  .abk-root .layout{display:block}
  .abk-root .sidebar{
    position:fixed;left:24px;top:76px;
    width:300px;max-height:calc(100vh - 100px);overflow-y:auto;
    display:flex;flex-direction:column;gap:16px;
    z-index:140;
  }
}
.abk-root .to-top{
  position:fixed;right:18px;bottom:132px;z-index:160;
  width:44px;height:44px;border-radius:50%;
  background:var(--panel2);border:1px solid var(--line);color:var(--paper);
  display:grid;place-items:center;font-size:18px;cursor:pointer;
  transition:border-color .15s, background .15s, transform .08s, opacity .2s;
  opacity:.85;
}
.abk-root .to-top:hover{border-color:var(--amber);opacity:1}
.abk-root .to-top:active{transform:scale(.94)}
@media (min-width:900px){
  .abk-root .to-top{bottom:28px}
}

/* ---------- header ---------- */
.abk-root header{
  border:1px solid var(--line);
  border-radius:18px;
  background:linear-gradient(160deg,var(--panel2),var(--panel));
  padding:28px 26px 24px;
  position:relative;
  overflow:hidden;
}
.abk-root header::after{
  content:"";
  position:absolute;inset:0;
  background:
    radial-gradient(600px 200px at 85% -20%, rgba(255,180,84,.14), transparent 60%),
    repeating-linear-gradient(90deg, transparent 0 46px, rgba(139,152,179,.05) 46px 47px);
  pointer-events:none;
}
.abk-root .eyebrow-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;position:relative;z-index:1}
.abk-root .eyebrow{
  font-family:'Chakra Petch',sans-serif;
  font-size:11px;letter-spacing:.28em;text-transform:uppercase;
  color:var(--radio);
  display:flex;align-items:center;gap:8px;
}
.abk-root .eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--radio);box-shadow:0 0 8px var(--radio);animation:abk-pulse 2s infinite}
@keyframes abk-pulse{0%,100%{opacity:1}50%{opacity:.35}}
.abk-root .lang-switch{
  font-family:'Chakra Petch',sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--ink);background:var(--amber);border:1px solid var(--amber);border-radius:999px;
  padding:7px 14px;text-decoration:none;white-space:nowrap;
  transition:background .15s, transform .1s;
}
.abk-root .lang-switch:hover{background:#ffc370;transform:translateY(-1px)}
.abk-root h1{
  font-family:'Chakra Petch',sans-serif;
  font-size:clamp(28px,5vw,42px);
  letter-spacing:.01em;
  margin-top:10px;line-height:1.05;
}
.abk-root h1 span{color:var(--amber)}
.abk-root .sub{color:var(--dim);margin-top:10px;font-size:15px;max-width:52ch}
.abk-root .narrator{
  margin-top:16px;display:inline-flex;align-items:center;gap:10px;
  font-family:'Chakra Petch',sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--amber);border:1px solid rgba(255,180,84,.35);border-radius:999px;padding:7px 14px;
  background:rgba(255,180,84,.06);
}

/* ---------- chapter map ---------- */
.abk-root .map{
  display:grid;gap:8px;
  border:1px solid var(--line);border-radius:16px;
  background:linear-gradient(160deg,var(--panel2),var(--panel));
  padding:16px 16px 12px;
}
.abk-root .map-title{
  font-family:'Chakra Petch',sans-serif;font-size:11px;letter-spacing:.24em;text-transform:uppercase;
  color:var(--dim);margin:6px 2px;
}
.abk-root .lvl{
  display:flex;align-items:center;gap:14px;
  border:1px solid var(--line);border-radius:12px;
  background:var(--panel);
  padding:12px 16px;cursor:pointer;
  transition:border-color .15s, background .15s, transform .1s;
  text-align:left;width:100%;color:var(--paper);font:inherit;
}
.abk-root .lvl:hover{border-color:var(--amber-deep);transform:translateX(3px)}
.abk-root .lvl.active{border-color:var(--amber);background:linear-gradient(90deg, rgba(255,180,84,.10), var(--panel) 55%)}
.abk-root .lvl .badge{
  font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:12px;
  color:var(--ink);background:var(--dim);
  min-width:56px;text-align:center;border-radius:7px;padding:5px 0;letter-spacing:.06em;
}
.abk-root .lvl.active .badge{background:var(--amber)}
.abk-root .lvl .t{font-family:'Chakra Petch',sans-serif;font-size:15px;letter-spacing:.02em}
.abk-root .lvl .d{color:var(--dim);font-size:12.5px;margin-top:2px}
.abk-root .lvl .eq{margin-left:auto;display:none;gap:2px;align-items:flex-end;height:16px}
.abk-root .lvl.active.playing .eq{display:flex}
.abk-root .eq i{width:3px;background:var(--amber);animation:abk-eq .9s infinite ease-in-out;border-radius:2px}
.abk-root .eq i:nth-child(1){height:6px;animation-delay:0s}
.abk-root .eq i:nth-child(2){height:14px;animation-delay:.2s}
.abk-root .eq i:nth-child(3){height:9px;animation-delay:.4s}
@keyframes abk-eq{0%,100%{transform:scaleY(.5)}50%{transform:scaleY(1.4)}}

/* ---------- reading pane ---------- */
.abk-root .reader{margin-top:26px}
.abk-root .ch-head{
  font-family:'Chakra Petch',sans-serif;
  color:var(--amber);
  font-size:13px;letter-spacing:.22em;text-transform:uppercase;
  margin:34px 0 6px;
}
.abk-root .ch-title{
  font-family:'Chakra Petch',sans-serif;
  font-size:clamp(21px,3.6vw,28px);
  margin-bottom:14px;
}
.abk-root .reader p{
  font-size:17.5px;line-height:1.78;
  color:#c9d2e4;
  margin:0 0 16px;
  padding:6px 12px;border-radius:10px;border-left:3px solid transparent;
  transition:background .25s,border-color .25s,color .25s;
  cursor:pointer;
}
.abk-root .reader p:hover{background:rgba(139,152,179,.06)}
.abk-root .reader p.now{
  background:rgba(255,180,84,.10);
  border-left-color:var(--amber);
  color:#fff;
}
.abk-root .reader p em{font-style:italic}
.abk-root .reader p strong{color:#fff}
.abk-root .reader ul{margin:0 0 16px 8px;padding-left:18px}
.abk-root .reader li{
  font-size:17px;line-height:1.7;color:#c9d2e4;margin-bottom:10px;
  padding:4px 10px;border-radius:10px;border-left:3px solid transparent;cursor:pointer;
  transition:background .25s,border-color .25s;
}
.abk-root .reader li.now{background:rgba(89,211,162,.10);border-left-color:var(--radio);color:#fff}
.abk-root .divider{border:none;border-top:1px solid var(--line);margin:30px 0}

/* ---------- player bar (mobile: fixed bottom bar; desktop: sticky sidebar card, see below) ---------- */
.abk-root .side-player{
  position:fixed;left:0;right:0;bottom:0;z-index:150;
  background:rgba(14,20,32,.92);
  backdrop-filter:blur(14px);
  border-top:1px solid var(--line);
}
.abk-root .side-player-inner{max-width:860px;margin:0 auto;padding:14px 20px 18px}
@media (min-width:900px){
  .abk-root .side-player{
    position:static;left:auto;right:auto;bottom:auto;
    background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:1px solid var(--line);border-radius:16px;
    backdrop-filter:none;
  }
  .abk-root .side-player-inner{max-width:none;padding:16px}
  .abk-root .side-player .row{flex-direction:column;align-items:stretch;gap:14px;margin-top:14px}
  .abk-root .side-player .ctrl{justify-content:center}
  .abk-root .side-player .now-line{
    flex-basis:auto;white-space:normal;overflow:visible;text-overflow:clip;font-size:12px;text-align:center;
  }
  .abk-root .side-player .opts{flex-direction:column;align-items:stretch}
  .abk-root .side-player select,.abk-root .side-player .rate{max-width:none;width:100%}
  .abk-root .side-player .rate{justify-content:space-between}
}
.abk-root .prog{
  height:5px;border-radius:99px;background:var(--panel2);overflow:hidden;cursor:pointer;
}
.abk-root .prog .fill{height:100%;width:0%;background:linear-gradient(90deg,var(--amber-deep),var(--amber));transition:width .3s}
.abk-root .row{display:flex;align-items:center;gap:14px;margin-top:12px;flex-wrap:wrap}
.abk-root .now-line{
  font-family:'Chakra Petch',sans-serif;font-size:12px;letter-spacing:.1em;
  color:var(--dim);min-width:0;flex:1 1 180px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.abk-root .now-line b{color:var(--amber);font-weight:700}
.abk-root .ctrl{display:flex;align-items:center;gap:10px}
.abk-root button.icon{
  background:var(--panel2);border:1px solid var(--line);color:var(--paper);
  width:44px;height:44px;border-radius:50%;
  display:grid;place-items:center;cursor:pointer;font-size:16px;
  transition:border-color .15s, background .15s, transform .08s;
}
.abk-root button.icon:hover{border-color:var(--amber)}
.abk-root button.icon:active{transform:scale(.94)}
.abk-root button.play{
  width:58px;height:58px;background:var(--amber);color:var(--ink);
  border:none;font-size:21px;box-shadow:0 6px 22px rgba(255,180,84,.35);
}
.abk-root button.play:hover{background:#ffc370}
.abk-root .opts{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.abk-root select,.abk-root .rate{
  background:var(--panel2);border:1px solid var(--line);color:var(--paper);
  font-family:'Chakra Petch',sans-serif;font-size:12px;
  border-radius:9px;padding:8px 10px;max-width:200px;
}
.abk-root .rate{display:flex;align-items:center;gap:8px}
.abk-root input[type=range]{accent-color:var(--amber);width:90px}
.abk-root .voice-note{
  font-size:11px;color:var(--dim);width:100%;margin-top:6px;
  font-family:'Chakra Petch',sans-serif;letter-spacing:.04em;
}
.abk-root .voice-note b{color:var(--radio)}
.abk-root button:focus-visible,.abk-root select:focus-visible,.abk-root input:focus-visible,.abk-root .lvl:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
@media (prefers-reduced-motion: reduce){
  .abk-root *{animation:none!important;transition:none!important}
}
@media (max-width:640px){
  .abk-root .reader p{font-size:16.5px}
  .abk-root .now-line{flex-basis:100%}
}

/* ---------- Chinese-language typography overrides ---------- */
.abk-root.lang-zh{
  --cjk:'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif;
  font-family:var(--cjk);
}
.abk-root.lang-zh h1,
.abk-root.lang-zh .eyebrow,
.abk-root.lang-zh .lang-switch,
.abk-root.lang-zh .map-title,
.abk-root.lang-zh .ch-head,
.abk-root.lang-zh .ch-title,
.abk-root.lang-zh .now-line,
.abk-root.lang-zh .lvl .t,
.abk-root.lang-zh .lvl .d,
.abk-root.lang-zh .voice-note,
.abk-root.lang-zh .rate,
.abk-root.lang-zh .narrator,
.abk-root.lang-zh select{
  font-family:var(--cjk);
  letter-spacing:0;
}
.abk-root.lang-zh .reader p,
.abk-root.lang-zh .reader li{
  font-family:var(--cjk);
  line-height:1.95;
}
`;

/* ================================================================
   Shared audiobook player, parameterized by a `cfg` object so the
   English and Chinese editions can reuse one playback engine.
   See app/audiobook/page.js and app/audiobook/zh/page.js for the
   two configs.
================================================================= */
export default function AudiobookPlayer({ cfg }) {
  const readerRef = useRef(null);
  const mapRef = useRef(null);
  const voiceSelRef = useRef(null);
  const voiceNoteRef = useRef(null);
  const rateInputRef = useRef(null);
  const rateValRef = useRef(null);
  const btnPlayRef = useRef(null);
  const nowLineRef = useRef(null);
  const progFillRef = useRef(null);
  const progRef = useRef(null);

  // Always land at the true top of the page on mount, so the sticky site
  // navbar never ends up pinned over a partially-scrolled header (which
  // happens if the browser restores a previous scroll position on load).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const BOOK = cfg.book;
    const readerEl = readerRef.current;
    const mapEl = mapRef.current;
    const voiceSel = voiceSelRef.current;
    const voiceNote = voiceNoteRef.current;
    const rateInput = rateInputRef.current;
    const rateVal = rateValRef.current;
    const btnPlay = btnPlayRef.current;
    const nowLine = nowLineRef.current;
    const progFill = progFillRef.current;
    const progEl = progRef.current;
    if (!readerEl || !mapEl) return undefined;

    const synth = window.speechSynthesis;
    let voices = [];
    let current = 0;
    let isPlaying = false;

    /* ---- Studio narration: pre-generated real-voice MP3s (see scripts/generate-audio.mjs).
       If the manifest exists and covers every paragraph, the player uses real audio
       files; otherwise it falls back to the browser's speech synthesis. ---- */
    let audioMode = false;
    let audioFiles = null;
    const audioEl = new Audio();
    audioEl.preload = "auto";

    const flatUnits = []; // {chapter, el, text}

    /* ================= BUILD DOM ================= */
    function registerUnit(ci, el, text) {
      const idx = flatUnits.length;
      flatUnits.push({ chapter: ci, el, text });
      el.addEventListener("click", () => {
        jumpTo(idx);
        play();
      });
    }
    function chapterStart(ci) {
      return flatUnits.findIndex((u) => u.chapter === ci);
    }

    BOOK.forEach((ch, ci) => {
      const b = document.createElement("button");
      b.className = "lvl";
      b.dataset.ch = ci;
      const isDebrief = cfg.isDebrief(ch);
      const strippedTitle = ch.title.replace(cfg.titleStripRegex, "");
      const descLine = isDebrief ? cfg.debriefText : ch.title.split(cfg.titleSplitChar)[0];
      b.innerHTML = `<span class="badge">LVL ${ci + 1}</span>
        <span><span class="t">${strippedTitle}</span>
        <div class="d">${descLine}</div></span>
        <span class="eq"><i></i><i></i><i></i></span>`;
      b.addEventListener("click", () => {
        jumpTo(chapterStart(ci));
        play();
      });
      mapEl.appendChild(b);

      const head = document.createElement("div");
      head.className = "ch-head";
      head.textContent = cfg.levelHeadText(ci);
      const title = document.createElement("h2");
      title.className = "ch-title";
      title.textContent = ch.title;
      readerEl.appendChild(head);
      readerEl.appendChild(title);

      ch.paras.forEach((p) => {
        if (typeof p === "object" && p.list) {
          const ul = document.createElement("ul");
          p.list.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
            registerUnit(ci, li, item);
          });
          readerEl.appendChild(ul);
        } else {
          const el = document.createElement("p");
          el.textContent = p;
          readerEl.appendChild(el);
          registerUnit(ci, el, p);
        }
      });
      if (ci < BOOK.length - 1) {
        const hr = document.createElement("hr");
        hr.className = "divider";
        readerEl.appendChild(hr);
      }
    });

    /* ================= STUDIO NARRATION DISCOVERY ================= */
    fetch(cfg.manifestPath)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m || !Array.isArray(m.units)) return;
        // Only trust the manifest if it covers every paragraph exactly.
        if (m.units.length !== flatUnits.length || m.units.some((u) => !u || !u.file)) return;
        audioFiles = m.units.map((u) => cfg.manifestAudioBase + u.file);
        audioMode = true;
        if (voiceSel) voiceSel.style.display = "none";
        if (voiceNote) voiceNote.innerHTML = cfg.studioNoteHTML(m.provider);
      })
      .catch(() => {});

    /* ================= SPEECH ENGINE ================= */
    function loadVoices() {
      voices = synth.getVoices().filter((v) => v.lang.startsWith(cfg.voiceLangPrefix));
      if (!voices.length) voices = synth.getVoices();
      voiceSel.innerHTML = "";
      voices.forEach((v, i) => {
        const o = document.createElement("option");
        o.value = i;
        o.textContent = `${v.name}`;
        voiceSel.appendChild(o);
      });
      let pick = -1;
      for (const rule of cfg.voicePreferenceRules) {
        pick = voices.findIndex(rule);
        if (pick >= 0) break;
      }
      if (pick < 0) pick = 0;
      voiceSel.value = pick;
      if (audioMode) return; // studio narration active — don't overwrite the narrator note
      voiceNote.innerHTML = cfg.buildVoiceNote(voices[pick]);
    }
    loadVoices();
    synth.onvoiceschanged = loadVoices;

    function advance() {
      if (!isPlaying) return;
      if (current < flatUnits.length - 1) {
        current++;
        highlight();
        speakCurrent();
      } else {
        stop();
        nowLine.innerHTML = cfg.completeHTML;
      }
    }
    audioEl.addEventListener("ended", advance);

    function speakCurrent() {
      if (!flatUnits[current]) {
        stop();
        return;
      }
      if (audioMode && audioFiles) {
        synth.cancel();
        audioEl.src = audioFiles[current];
        audioEl.playbackRate = +rateInput.value;
        audioEl.play().catch(() => {});
        // Warm the browser cache for the next paragraph so playback feels gapless.
        if (audioFiles[current + 1]) fetch(audioFiles[current + 1]).catch(() => {});
        highlight();
        return;
      }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(flatUnits[current].text);
      const v = voices[+voiceSel.value];
      if (v) u.voice = v;
      u.rate = +rateInput.value;
      u.pitch = 1.0;
      u.onend = advance;
      u.onerror = () => {};
      synth.speak(u);
      highlight();
    }

    function highlight(shouldScroll = true) {
      flatUnits.forEach((u) => u.el.classList.remove("now"));
      const u = flatUnits[current];
      if (!u) return;
      u.el.classList.add("now");
      if (shouldScroll) u.el.scrollIntoView({ block: "center", behavior: "smooth" });
      mapEl.querySelectorAll(".lvl").forEach((l) => {
        const on = +l.dataset.ch === u.chapter;
        l.classList.toggle("active", on);
        l.classList.toggle("playing", on && isPlaying);
      });
      const chTitle = BOOK[u.chapter].title;
      nowLine.innerHTML = `<b>${isPlaying ? cfg.onAirLabel : cfg.pausedLabel}</b> — ${chTitle}`;
      progFill.style.width = (current / (flatUnits.length - 1)) * 100 + "%";
    }

    // Chrome (and some other browsers) will silently stall an in-progress
    // utterance after ~15s once the tab is backgrounded/minimized. Nudging
    // the engine with a harmless pause/resume keeps it talking so playback
    // continues uninterrupted in the background until the user pauses it
    // or the story ends.
    let keepAliveTimer = null;
    function startKeepAlive() {
      stopKeepAlive();
      keepAliveTimer = setInterval(() => {
        if (isPlaying && synth.speaking) {
          synth.pause();
          synth.resume();
        }
      }, 10000);
    }
    function stopKeepAlive() {
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }
    }

    function play() {
      isPlaying = true;
      btnPlay.textContent = "⏸";
      if (!audioMode) startKeepAlive();
      speakCurrent();
    }
    function pause() {
      isPlaying = false;
      stopKeepAlive();
      synth.cancel();
      audioEl.pause();
      btnPlay.textContent = "▶";
      highlight();
    }
    function stop() {
      isPlaying = false;
      stopKeepAlive();
      synth.cancel();
      audioEl.pause();
      btnPlay.textContent = "▶";
      mapEl.querySelectorAll(".lvl").forEach((l) => l.classList.remove("playing"));
      progFill.style.width = "100%";
    }
    function jumpTo(idx) {
      current = Math.max(0, Math.min(flatUnits.length - 1, idx));
      if (isPlaying) speakCurrent();
      else highlight();
    }

    function onPlayClick() {
      isPlaying ? pause() : play();
    }
    function onFwdClick() {
      jumpTo(current + 1);
    }
    function onBackClick() {
      jumpTo(current - 1);
    }
    function onNextClick() {
      const next = BOOK.findIndex((c, i) => i > flatUnits[current].chapter);
      jumpTo(next >= 0 ? chapterStart(next) : flatUnits.length - 1);
    }
    function onPrevClick() {
      const ch = flatUnits[current].chapter;
      const start = chapterStart(ch);
      jumpTo(current > start ? start : chapterStart(Math.max(0, ch - 1)));
    }
    function onVoiceChange() {
      if (audioMode) return; // studio narration has one fixed narrator
      if (isPlaying) speakCurrent();
    }
    function onRateInput() {
      rateVal.textContent = (+rateInput.value).toFixed(2) + "×";
      if (audioMode) {
        audioEl.playbackRate = +rateInput.value; // live, no restart needed
      } else if (isPlaying) {
        speakCurrent();
      }
    }
    function onProgClick(e) {
      const r = e.currentTarget.getBoundingClientRect();
      jumpTo(Math.round(((e.clientX - r.left) / r.width) * (flatUnits.length - 1)));
    }
    function onKeydown(e) {
      if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        isPlaying ? pause() : play();
      }
      if (e.code === "ArrowRight") jumpTo(current + 1);
      if (e.code === "ArrowLeft") jumpTo(current - 1);
    }

    const btnFwd = document.getElementById(cfg.ids.fwd);
    const btnBack = document.getElementById(cfg.ids.back);
    const btnNext = document.getElementById(cfg.ids.next);
    const btnPrev = document.getElementById(cfg.ids.prev);

    btnPlay.addEventListener("click", onPlayClick);
    btnFwd.addEventListener("click", onFwdClick);
    btnBack.addEventListener("click", onBackClick);
    btnNext.addEventListener("click", onNextClick);
    btnPrev.addEventListener("click", onPrevClick);
    voiceSel.addEventListener("change", onVoiceChange);
    rateInput.addEventListener("input", onRateInput);
    progEl.addEventListener("click", onProgClick);
    document.addEventListener("keydown", onKeydown);

    highlight(false); // initial paint only — don't auto-scroll the page on load

    return () => {
      isPlaying = false;
      stopKeepAlive();
      synth.cancel();
      audioEl.removeEventListener("ended", advance);
      audioEl.pause();
      audioEl.removeAttribute("src");
      if (synth.onvoiceschanged === loadVoices) synth.onvoiceschanged = null;
      btnPlay.removeEventListener("click", onPlayClick);
      btnFwd.removeEventListener("click", onFwdClick);
      btnBack.removeEventListener("click", onBackClick);
      btnNext.removeEventListener("click", onNextClick);
      btnPrev.removeEventListener("click", onPrevClick);
      voiceSel.removeEventListener("change", onVoiceChange);
      rateInput.removeEventListener("input", onRateInput);
      progEl.removeEventListener("click", onProgClick);
      document.removeEventListener("keydown", onKeydown);
      readerEl.innerHTML = "";
      mapEl.innerHTML = "";
    };
  }, [cfg]);

  return (
    <div className={`abk-root${cfg.lang === "zh" ? " lang-zh" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: AUDIOBOOK_CSS }} />
      <div className="wrap">
        <header>
          <div className="eyebrow-row">
            <div className="eyebrow">
              <span className="dot"></span> {cfg.eyebrow}
            </div>
            <Link href={cfg.otherLang.href} className="lang-switch">
              {cfg.otherLang.label}
            </Link>
          </div>
          <h1>
            {cfg.titleMain}
            <span>{cfg.titleAccent}</span>
          </h1>
          <p className="sub">{cfg.subtitle}</p>
          <div className="narrator">{cfg.narratorLine}</div>
        </header>

        <div className="layout">
          <aside className="sidebar">
            <div className="side-player">
              <div className="side-player-inner">
                <div className="prog" ref={progRef} id={cfg.ids.prog}>
                  <div className="fill" ref={progFillRef} id={cfg.ids.progFill}></div>
                </div>
                <div className="row">
                  <div
                    className="now-line"
                    ref={nowLineRef}
                    id={cfg.ids.nowLine}
                    dangerouslySetInnerHTML={{ __html: cfg.readyHTML }}
                  ></div>
                  <div className="ctrl">
                    <button
                      className="icon"
                      id={cfg.ids.prev}
                      title={cfg.prevChapterTitle}
                      aria-label={cfg.prevChapterTitle}
                    >
                      ⏮
                    </button>
                    <button className="icon" id={cfg.ids.back} title={cfg.backTitle} aria-label={cfg.backTitle}>
                      ↺
                    </button>
                    <button className="icon play" ref={btnPlayRef} title={cfg.playTitle} aria-label={cfg.playTitle}>
                      ▶
                    </button>
                    <button className="icon" id={cfg.ids.fwd} title={cfg.fwdTitle} aria-label={cfg.fwdTitle}>
                      ↻
                    </button>
                    <button
                      className="icon"
                      id={cfg.ids.next}
                      title={cfg.nextChapterTitle}
                      aria-label={cfg.nextChapterTitle}
                    >
                      ⏭
                    </button>
                  </div>
                  <div className="opts">
                    <select
                      ref={voiceSelRef}
                      id={cfg.ids.voiceSel}
                      title={cfg.narratorSelectLabel}
                      aria-label={cfg.narratorSelectLabel}
                    ></select>
                    <div className="rate">
                      {cfg.speedLabel}{" "}
                      <input
                        type="range"
                        ref={rateInputRef}
                        id={cfg.ids.rate}
                        min="0.6"
                        max="1.4"
                        step="0.05"
                        defaultValue="0.95"
                      />
                      <span ref={rateValRef} id={cfg.ids.rateVal}>
                        0.95×
                      </span>
                    </div>
                  </div>
                  <div className="voice-note" ref={voiceNoteRef} id={cfg.ids.voiceNote}>
                    {cfg.loadingVoicesText}
                  </div>
                </div>
              </div>
            </div>

            <div className="map">
              <div className="map-title">{cfg.mapTitle}</div>
              <div ref={mapRef} id={cfg.ids.chapterMap}></div>
            </div>
          </aside>

          <main className="reader" ref={readerRef} id={cfg.ids.reader}></main>
        </div>
      </div>

      <button
        className="to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
