"use client";

import AudiobookPlayer from "./AudiobookPlayer";
import { BOOK } from "./book-data";

const EN_CFG = {
  lang: "en",
  book: BOOK,
  manifestPath: "/audio/manifest.json",
  manifestAudioBase: "/audio/",

  eyebrow: "Academy Audiobook · Squad Frequency 12.0",
  titleMain: "The Level-Up ",
  titleAccent: "Rule",
  subtitle:
    "A story for anyone who’s ever been thrown in the deep end. Press play, follow the amber highlight, and listen like it’s a mission briefing.",
  narratorLine: "🎙 Narrated by Leo",
  mapTitle: "Mission Select",
  debriefText: "Debrief — your mission starts here",

  titleStripRegex: /^Chapter \d+: |^Your Turn: /,
  titleSplitChar: ":",
  isDebrief: (ch) => ch.title.startsWith("Your Turn"),
  levelHeadText: (ci) => `Level ${ci + 1}`,

  readyHTML: "<b>READY</b> — press play to begin Chapter 1",
  completeHTML: "<b>COMPLETE</b> — mission accomplished. Replay any level above.",
  onAirLabel: "ON AIR",
  pausedLabel: "PAUSED",
  speedLabel: "SPEED",
  narratorSelectLabel: "Narrator voice",
  loadingVoicesText: "Loading voices from your device…",
  prevChapterTitle: "Previous chapter",
  backTitle: "Back one paragraph",
  playTitle: "Play / Pause",
  fwdTitle: "Forward one paragraph",
  nextChapterTitle: "Next chapter",

  voiceLangPrefix: "en",
  voicePreferenceRules: [
    (v) => /leo/i.test(v.name),
    (v) => /natural/i.test(v.name) && /(guy|male|ryan|eric|christopher|andrew|brian|davis)/i.test(v.name),
    (v) =>
      /(daniel|alex|fred|google uk english male|microsoft (guy|ryan|eric|christopher|andrew|brian|davis))/i.test(
        v.name
      ),
    (v) => /natural|neural|premium|enhanced/i.test(v.name),
    (v) => v.default,
  ],
  studioNoteHTML: (provider) =>
    `Narrator locked: <b>studio recording</b> — real-voice narration (${provider}). Speed control still works.`,
  buildVoiceNote: (chosen) => {
    if (!chosen) return "No speech voices available in this browser.";
    if (/leo/i.test(chosen.name)) return `Narrator locked: <b>${chosen.name}</b> — Leo is live on this device.`;
    return `No voice named "Leo" found on this device — auto-selected <b>${chosen.name}</b>, the closest natural narrator. You can switch voices above.`;
  },

  otherLang: { href: "/audiobook/zh", label: "中文版 →" },

  ids: {
    chapterMap: "abkChapterMap",
    reader: "abkReader",
    prog: "abkProg",
    progFill: "abkProgFill",
    nowLine: "abkNowLine",
    prev: "abkBtnPrev",
    back: "abkBtnBack",
    fwd: "abkBtnFwd",
    next: "abkBtnNext",
    voiceSel: "abkVoiceSel",
    rate: "abkRate",
    rateVal: "abkRateVal",
    voiceNote: "abkVoiceNote",
  },
};

export default function AudiobookPage() {
  return <AudiobookPlayer cfg={EN_CFG} />;
}
