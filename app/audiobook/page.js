"use client";

import { useEffect, useRef } from "react";

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
.abk-root .eyebrow{
  font-family:'Chakra Petch',sans-serif;
  font-size:11px;letter-spacing:.28em;text-transform:uppercase;
  color:var(--radio);
  display:flex;align-items:center;gap:8px;
}
.abk-root .eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--radio);box-shadow:0 0 8px var(--radio);animation:abk-pulse 2s infinite}
@keyframes abk-pulse{0%,100%{opacity:1}50%{opacity:.35}}
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
.abk-root .map{margin-top:22px;display:grid;gap:8px}
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

/* ---------- player bar ---------- */
.abk-root .player{
  position:fixed;left:0;right:0;bottom:0;z-index:150;
  background:rgba(14,20,32,.92);
  backdrop-filter:blur(14px);
  border-top:1px solid var(--line);
}
.abk-root .player-inner{max-width:860px;margin:0 auto;padding:14px 20px 18px}
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
`;

/* ================= STORY DATA ================= */
const BOOK = [
  {
    title: "Chapter 1: The System",
    paras: [
      "There are two kinds of silence on an airsoft field. The first is the bad kind — the silence of a player who's frozen, who doesn't know where the enemy is or what to do next. The second is the good kind: the silence of a player who knows exactly where everyone is, and is simply waiting for the right second to move.",
      "Bob Reyes, twelve years old, had spent most of his life learning the difference.",
      "On weekends he was the best striker on his soccer team — the kid who could read a defense the way other kids read comic books, seeing the whole play unfold two passes before it happened. On weeknights he was a Battlefield legend, calling flanks and rotations for his squad like a general who'd already seen the ending of the battle. And every other Saturday, out at the airsoft field, he put on his vest and lived inside the good kind of silence.",
      "Lately, one more thing had joined the list — and it was the one nobody would have predicted a year ago.",
      "Math.",
      "That hadn't always been true. There was a time when studying felt like the bad kind of silence: read a page, feel nothing, wait three days for a graded test to tell you whether any of it had gone in. It was like playing Battlefield with the screen turned off. Then Dan — his neighbor from two doors down, a lanky teenager permanently mid-repair on a bike that never stayed fixed, and the closest thing Bob had to an older brother — had shown him a different way to play.",
      "Dan called it a system. Bob called it the Level-Up Rule.",
      "It had three moving parts, and none of them were complicated. Fast feedback: never wait to find out if you're right — solve a problem, check it instantly, get the \"ding\" the way a game gives you one. Control: you pick the order, you pick the pace, you run the mission instead of letting the mission run you. Balance: if something feels impossible, you didn't fail — you just walked in at the wrong difficulty, so drop down one level, win there, and climb back up. Holding it all together was a three-line planner Bob filled out every night, ninety seconds, no excuses: What worked. What didn't. Tomorrow's target.",
      "Six months of that loop — a little bit, almost every day — and something quietly extraordinary happened. Bob became the kid who finished quizzes early. The kid who checked his work instead of praying over it. The kid who raised his hand.",
      "So when his teacher announced that the school was forming a competition math team — real tournaments, real trophies, the works — Bob heard it the way he heard a new map dropping in Battlefield.",
      "\"Sign me up,\" he said, before she'd even finished the sentence. \"I'm ready for harder.\"",
      "He would remember saying that.",
    ],
  },
  {
    title: "Chapter 2: The Shark Tank",
    paras: [
      "He was not ready for harder.",
      "The first team practice didn't look anything like his math book. It didn't look like math at all. There was a problem about ants marching around the edges of a hexagon. Another about the last digit of a number multiplied by itself fifty times — fifty! — with a note cheerfully suggesting you should not actually compute it. Another had no numbers whatsoever, just shapes, arrows, and a question mark that seemed to be personally mocking him.",
      "Bob stared at his page and waited for the click. The click that always came now. The little spark of oh, I see it.",
      "Nothing. No ding. No pattern. Just static — and the sound of pencils moving all around him.",
      "That was the worst part. He could hear it working for everyone else. Across the table, a girl named Priya glanced at the ant problem for maybe ten seconds, murmured \"oh, it's just symmetry,\" and solved it before Bob had finished reading the question twice. A kid named Marcus cracked the fifty-multiplications monster by noticing that the last digits repeated in a cycle of four — a move so alien to Bob that it might as well have been a spell.",
      "By the end of practice, Bob had solved one problem. Out of twelve.",
      "He walked home the long way, past the airsoft field, and didn't even look at it.",
      "\"I don't get it,\" he told Dan that night, dropping his bag by the door like it weighed forty pounds. \"Everyone in that room is just built different. I'm not smart like that. You know how in swim class they'd never throw a beginner straight into the deep end with the actual competitive swimmers? That's what today was. Except somebody threw me in the deep end, and the deep end had sharks in it, and every shark in there has been training in that pool for years.\"",
      "He waited for it — the thing adults always said. You'll get it. Don't worry. Everyone struggles at first. The words that were supposed to help and never did.",
      "Dan didn't say it. Dan just kept threading the bike chain and asked one question.",
      "\"How long has Priya been doing this?\"",
      "Bob blinked. \"I think... since fourth grade?\"",
      "\"So two years.\" Dan finally looked up. \"You walked into a room today and measured yourself against two years of specific training — on day one — and when you came up short, you decided the problem was your brain.\" He shook his head slowly. \"Bob. Your system isn't broken. You just aimed it at the wrong target.\"",
    ],
  },
  {
    title: "Chapter 3: The Napkin",
    paras: [
      "\"What do you mean, wrong target?\"",
      "\"Third rule of your own system. Balance. Find your actual level — not the level you wish you were at — and climb from there. You lived by that rule for six months. Then today, the first time it really mattered, you forgot it existed. You jumped straight to problems that took Priya two years to be ready for, took one look at the gap, and decided the gap was proof there was something wrong with you.\" Dan set the chain down. \"It isn't proof of anything. Except that you skipped every single rung on the ladder between where you are and where she is.\"",
      "Bob turned that over. \"So I need easier competition problems. Not regular math — but not the shark tank either. The middle.\"",
      "\"The middle,\" Dan agreed. \"That's half of it. Here's the other half — and this is the part that's going to change everything, so listen.\" He leaned forward. \"You think Priya saw the answer today. She didn't. She recognized it. There's a difference, and the difference is the whole secret. Competition math isn't a talent contest. It's a game with moves — real, learnable, drillable moves — the same way soccer has moves. When Priya said 'it's just symmetry,' that wasn't genius striking like lightning. That was a move she's drilled a hundred times, so deep it's automatic. Same way you don't think about your first touch anymore. Your foot just knows.\"",
      "\"Then what are the moves?\"",
      "Dan grabbed a napkin — of course it was a napkin — and wrote fast.",
      {
        list: [
          "Try small cases. Problem too huge? Shrink it. Try it with 2 ants instead of 50. Watch what happens. The pattern will wave at you.",
          "Work backwards. Start from where you want to end up, and ask what would have to be true one step before that. Then one step before that.",
          "Draw it. Words are camouflage. Half of all \"impossible\" problems surrender the moment you sketch them.",
          "Hunt the cycle. Numbers and shapes love to repeat. Find the loop instead of grinding through fifty steps by hand — that's how Marcus killed the monster today.",
        ],
      },
      "He slid the napkin across the table like it was classified intel.",
      "\"These aren't superpowers, Bob. They're drills. Priya's done her reps. You haven't done yours yet.\" He tapped the napkin once. \"That word — yet — is the entire gap between you and her. Not talent. Reps.\"",
      "Bob stared at the napkin for a long moment.",
      "Then he folded it, carefully, and put it in his pocket like a map.",
    ],
  },
  {
    title: "Chapter 4: The Climb",
    paras: [
      "Bob didn't go back to the team the next week hoping to beat Priya. Hope wasn't a plan. He went back with a plan.",
      "He hunted down a stack of entry-level competition problems — the kind built for kids starting the climb, not finishing it — and ran his system on them exactly the way he'd run it on fractions six months ago. Solve one, check it instantly — get the ding. Pick his own order, ugliest problem first, while his brain was fresh. And when a problem stopped him cold, he didn't slam into it over and over like a locked door. He stepped back, found an easier problem of the same type, beat that one, and came back with the key.",
      "But now there was a fourth line in his nightly planner, right under the original three: What worked. What didn't. Tomorrow's target. Move I used today.",
      "Small cases. Drew it out. Worked backwards. Hunted the cycle. One line a night. Sometimes one word.",
      "It didn't feel like a montage. Real climbing never does. Some nights he solved three problems and felt like a genius; some nights he solved zero and wrote \"tried small cases, still stuck, retry Thursday\" and went to bed annoyed. But he kept showing up — a little bit, most days, the way you train for a season instead of cramming for a scrimmage — and slowly, almost sneakily, the moves stopped being things he did and started being things he was.",
      "He caught himself sketching a diagram before he'd finished reading a question. He spotted a repeating cycle in a calendar problem before anyone told him to look. One Tuesday he worked a problem backwards so smoothly that he flipped to the solution expecting to be wrong — and wasn't.",
      "He wasn't Priya. Not yet, and maybe not for a while.",
      "But the static was gone. And in its place, more and more often, was the good kind of silence — the silence of a player who knows exactly where everything is, and is simply waiting for the right second to move.",
    ],
  },
  {
    title: "Chapter 5: The Deep End, Revisited",
    paras: [
      "Three weeks later, the coach dropped a fresh set of twelve problems on the table, and the room went quiet with pencils.",
      "Bob didn't solve twelve. Let's be honest with each other: this is not that kind of story.",
      "He solved five.",
      "Five doesn't sound like a movie ending. It felt like one anyway — because of which five, and because of what happened with the fourth one.",
      "Problem four was an ant problem. Different shape, different numbers, same species of monster that had flattened him three weeks earlier. And this time something in Bob's brain — some newly-drilled reflex — looked at it and thought, calm as a squad leader on comms: this smells like small cases.",
      "Three ants instead of fifty. Watch the pattern. There it is, waving.",
      "He solved it before Priya finished reading her own page.",
      "She looked up. Actually looked up, eyebrows raised, the way you look at a player who just did something the scouting report said they couldn't do. \"Wait. How'd you get that one so fast?\"",
      "Bob grinned. \"Two years of reps,\" he said, \"compressed into three weeks of not panicking.\"",
      "That night he texted Dan a photo of his practice sheet — five checkmarks, circled in red — with one message under it:",
      "\"Still not caught up. But I'm not scared of the deep end anymore. I'm learning to swim in it. Teach me the next move.\"",
      "Two doors down, a teenager looked at his phone, smiled, and went back to fixing a bike chain that would never stay fixed — because some things aren't really about the bike.",
    ],
  },
  {
    title: "Your Turn: The Level-Up Rule",
    paras: [
      "Here's the secret hiding inside Bob's story: nothing in it required talent. Not one chapter. Every single thing he did is a thing you can start doing tonight, on whatever your deep end happens to be.",
      "Rule one. Shrink the loop. Don't study in silence. Practice for a few minutes, then check yourself immediately — out loud, on paper, however. Games hook you with constant feedback. Give your brain the same ding, as often as you can.",
      "Rule two. Grab the wheel. You choose the order. You choose the pace. You set the checkpoints and the rewards. The moment learning becomes your mission instead of someone else's orders, everything gets lighter.",
      "Rule three. Set your own difficulty. \"Impossible\" almost always just means \"one level too high, for now.\" Step down, win there, climb back. That's not retreating. That's how every game — and every skill on Earth — is actually beaten.",
      "Rule four. When the gap looks huge, count reps, not talent. Someday you'll walk into a room where everyone seems built different — faster, sharper, years ahead. Remember the sharks: they weren't born in that pool. They just got there earlier and did their reps. Find the specific moves your challenge rewards, drill them at your real level, and come back a little at a time, most days. The word standing between you and them isn't \"smarter.\" It's \"yet.\"",
      "The deep end never actually gets shallower. That's the truth nobody tells you.",
      "You get stronger. You get so strong that one day you dive into water that used to terrify you, and you realize — mid-stroke, grinning — that somewhere along the way, without any announcement or trophy or montage, you became one of the swimmers the new kids are scared of.",
      "Then you do the only thing left to do.",
      "You turn around, find the kid frozen at the edge of the pool, and hand them the napkin.",
    ],
  },
];

export default function AudiobookPage() {
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

  useEffect(() => {
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
      b.innerHTML = `<span class="badge">LVL ${ci + 1}</span>
        <span><span class="t">${ch.title.replace(/^Chapter \d+: |^Your Turn: /, "")}</span>
        <div class="d">${ch.title.startsWith("Your Turn") ? "Debrief — your mission starts here" : ch.title.split(":")[0]}</div></span>
        <span class="eq"><i></i><i></i><i></i></span>`;
      b.addEventListener("click", () => {
        jumpTo(chapterStart(ci));
        play();
      });
      mapEl.appendChild(b);

      const head = document.createElement("div");
      head.className = "ch-head";
      head.textContent = `Level ${ci + 1}`;
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

    /* ================= SPEECH ENGINE ================= */
    function loadVoices() {
      voices = synth.getVoices().filter((v) => v.lang.startsWith("en"));
      if (!voices.length) voices = synth.getVoices();
      voiceSel.innerHTML = "";
      voices.forEach((v, i) => {
        const o = document.createElement("option");
        o.value = i;
        o.textContent = `${v.name}`;
        voiceSel.appendChild(o);
      });
      const prefer = [
        (v) => /leo/i.test(v.name),
        (v) => /natural/i.test(v.name) && /(guy|male|ryan|eric|christopher|andrew|brian|davis)/i.test(v.name),
        (v) => /(daniel|alex|fred|google uk english male|microsoft (guy|ryan|eric|christopher|andrew|brian|davis))/i.test(v.name),
        (v) => /natural|neural|premium|enhanced/i.test(v.name),
        (v) => v.default,
      ];
      let pick = -1;
      for (const rule of prefer) {
        pick = voices.findIndex(rule);
        if (pick >= 0) break;
      }
      if (pick < 0) pick = 0;
      voiceSel.value = pick;
      const chosen = voices[pick];
      if (chosen && /leo/i.test(chosen.name)) {
        voiceNote.innerHTML = `Narrator locked: <b>${chosen.name}</b> — Leo is live on this device.`;
      } else if (chosen) {
        voiceNote.innerHTML = `No voice named "Leo" found on this device — auto-selected <b>${chosen.name}</b>, the closest natural narrator. You can switch voices above.`;
      } else {
        voiceNote.textContent = "No speech voices available in this browser.";
      }
    }
    loadVoices();
    synth.onvoiceschanged = loadVoices;

    function speakCurrent() {
      if (!flatUnits[current]) {
        stop();
        return;
      }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(flatUnits[current].text);
      const v = voices[+voiceSel.value];
      if (v) u.voice = v;
      u.rate = +rateInput.value;
      u.pitch = 1.0;
      u.onend = () => {
        if (!isPlaying) return;
        if (current < flatUnits.length - 1) {
          current++;
          highlight();
          speakCurrent();
        } else {
          stop();
          nowLine.innerHTML = "<b>COMPLETE</b> — mission accomplished. Replay any level above.";
        }
      };
      u.onerror = () => {};
      synth.speak(u);
      highlight();
    }

    function highlight() {
      flatUnits.forEach((u) => u.el.classList.remove("now"));
      const u = flatUnits[current];
      if (!u) return;
      u.el.classList.add("now");
      u.el.scrollIntoView({ block: "center", behavior: "smooth" });
      mapEl.querySelectorAll(".lvl").forEach((l) => {
        const on = +l.dataset.ch === u.chapter;
        l.classList.toggle("active", on);
        l.classList.toggle("playing", on && isPlaying);
      });
      const chTitle = BOOK[u.chapter].title;
      nowLine.innerHTML = `<b>${isPlaying ? "ON AIR" : "PAUSED"}</b> — ${chTitle}`;
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
      startKeepAlive();
      speakCurrent();
    }
    function pause() {
      isPlaying = false;
      stopKeepAlive();
      synth.cancel();
      btnPlay.textContent = "▶";
      highlight();
    }
    function stop() {
      isPlaying = false;
      stopKeepAlive();
      synth.cancel();
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
      if (isPlaying) speakCurrent();
    }
    function onRateInput() {
      rateVal.textContent = (+rateInput.value).toFixed(2) + "×";
      if (isPlaying) speakCurrent();
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

    const btnFwd = document.getElementById("abkBtnFwd");
    const btnBack = document.getElementById("abkBtnBack");
    const btnNext = document.getElementById("abkBtnNext");
    const btnPrev = document.getElementById("abkBtnPrev");

    btnPlay.addEventListener("click", onPlayClick);
    btnFwd.addEventListener("click", onFwdClick);
    btnBack.addEventListener("click", onBackClick);
    btnNext.addEventListener("click", onNextClick);
    btnPrev.addEventListener("click", onPrevClick);
    voiceSel.addEventListener("change", onVoiceChange);
    rateInput.addEventListener("input", onRateInput);
    progEl.addEventListener("click", onProgClick);
    document.addEventListener("keydown", onKeydown);

    highlight();

    return () => {
      isPlaying = false;
      stopKeepAlive();
      synth.cancel();
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
  }, []);

  return (
    <div className="abk-root">
      <style dangerouslySetInnerHTML={{ __html: AUDIOBOOK_CSS }} />
      <div className="wrap">
        <header>
          <div className="eyebrow">
            <span className="dot"></span> Academy Audiobook &nbsp;&middot;&nbsp; Squad Frequency 12.0
          </div>
          <h1>
            The Level-Up <span>Rule</span>
          </h1>
          <p className="sub">
            A story for anyone who&rsquo;s ever been thrown in the deep end. Press play, follow
            the amber highlight, and listen like it&rsquo;s a mission briefing.
          </p>
          <div className="narrator">🎙 Narrated by Leo</div>

          <div className="map">
            <div className="map-title">Mission Select</div>
            <div ref={mapRef} id="abkChapterMap"></div>
          </div>
        </header>

        <main className="reader" ref={readerRef} id="abkReader"></main>
      </div>

      <div className="player">
        <div className="player-inner">
          <div className="prog" ref={progRef} id="abkProg">
            <div className="fill" ref={progFillRef} id="abkProgFill"></div>
          </div>
          <div className="row">
            <div className="now-line" ref={nowLineRef} id="abkNowLine">
              <b>READY</b> — press play to begin Chapter 1
            </div>
            <div className="ctrl">
              <button className="icon" id="abkBtnPrev" title="Previous chapter" aria-label="Previous chapter">
                ⏮
              </button>
              <button className="icon" id="abkBtnBack" title="Back one paragraph" aria-label="Back one paragraph">
                ↺
              </button>
              <button className="icon play" ref={btnPlayRef} title="Play / Pause" aria-label="Play or pause">
                ▶
              </button>
              <button className="icon" id="abkBtnFwd" title="Forward one paragraph" aria-label="Forward one paragraph">
                ↻
              </button>
              <button className="icon" id="abkBtnNext" title="Next chapter" aria-label="Next chapter">
                ⏭
              </button>
            </div>
            <div className="opts">
              <select ref={voiceSelRef} id="abkVoiceSel" title="Narrator voice" aria-label="Narrator voice"></select>
              <div className="rate">
                SPEED{" "}
                <input
                  type="range"
                  ref={rateInputRef}
                  id="abkRate"
                  min="0.6"
                  max="1.4"
                  step="0.05"
                  defaultValue="0.95"
                />
                <span ref={rateValRef} id="abkRateVal">
                  0.95×
                </span>
              </div>
            </div>
            <div className="voice-note" ref={voiceNoteRef} id="abkVoiceNote">
              Loading voices from your device…
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
