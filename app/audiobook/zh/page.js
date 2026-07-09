"use client";

import AudiobookPlayer from "../AudiobookPlayer";
import { BOOK_ZH } from "../book-data.zh";

const ZH_CFG = {
  lang: "zh",
  book: BOOK_ZH,
  manifestPath: "/audio/zh/manifest.json",
  manifestAudioBase: "/audio/zh/",

  eyebrow: "学院有声书 · 12号频道",
  titleMain: "升级",
  titleAccent: "法则",
  subtitle: "献给每一个曾经被扔进深水区的人。按下播放键，跟着琥珀色高亮走，像在听一场任务简报一样去听这个故事。",
  narratorLine: "🎙 中文语音朗读",
  mapTitle: "任务选单",
  debriefText: "复盘 — 你的任务从这里开始",

  titleStripRegex: /^第\d+章：|^你的任务：/,
  titleSplitChar: "：",
  isDebrief: (ch) => ch.title.startsWith("你的任务"),
  levelHeadText: (ci) => `第 ${ci + 1} 关`,

  readyHTML: "<b>准备就绪</b> — 按下播放键，开始第1章",
  completeHTML: "<b>任务完成</b> — 使命达成。可重新播放上方任意关卡。",
  onAirLabel: "播放中",
  pausedLabel: "已暂停",
  speedLabel: "语速",
  narratorSelectLabel: "朗读音色",
  loadingVoicesText: "正在加载设备语音…",
  prevChapterTitle: "上一章",
  backTitle: "后退一段",
  playTitle: "播放 / 暂停",
  fwdTitle: "前进一段",
  nextChapterTitle: "下一章",

  voiceLangPrefix: "zh",
  voicePreferenceRules: [
    (v) => /ting-?ting|mei-?jia|yaoyao|xiaoxiao|kangkang|yunxi|yunyang/i.test(v.name),
    (v) => /google/i.test(v.name) && /(普通话|mandarin|chinese)/i.test(v.name),
    (v) => /natural|neural|premium|enhanced/i.test(v.name) && /zh/i.test(v.lang),
    (v) => /zh/i.test(v.lang),
    (v) => v.default,
  ],
  studioNoteHTML: (provider) =>
    `叙述者已锁定：<b>录音室配音</b> — 真人语音朗读（${provider}）。语速仍可调节。`,
  buildVoiceNote: (chosen) => {
    if (!chosen) return "此浏览器没有可用的语音朗读功能。";
    if (/zh/i.test(chosen.lang)) return `叙述者：<b>${chosen.name}</b> — 本设备已找到中文朗读音色。`;
    return `本设备未找到中文语音，暂时使用 <b>${chosen.name}</b> 朗读，发音可能不准。可在上方切换音色，或安装系统的中文语音包以获得更好效果。`;
  },

  otherLang: { href: "/audiobook", label: "← English" },

  ids: {
    chapterMap: "abkZhChapterMap",
    reader: "abkZhReader",
    prog: "abkZhProg",
    progFill: "abkZhProgFill",
    nowLine: "abkZhNowLine",
    prev: "abkZhBtnPrev",
    back: "abkZhBtnBack",
    fwd: "abkZhBtnFwd",
    next: "abkZhBtnNext",
    voiceSel: "abkZhVoiceSel",
    rate: "abkZhRate",
    rateVal: "abkZhRateVal",
    voiceNote: "abkZhVoiceNote",
  },
};

export default function AudiobookZhPage() {
  return <AudiobookPlayer cfg={ZH_CFG} />;
}
