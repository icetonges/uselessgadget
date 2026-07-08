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
  {
    title: "Chapter 6: The Wall",
    paras: [
      "Part Two: The Secret Game. The story continues — for anyone who knows the moves, but can't make themselves start.",
      "Here is a strange thing nobody warns you about: sometimes you beat one monster, and a bigger one is standing right behind it, clapping.",
      "Three weeks after the day he out-solved Priya on the ant problem, Bob had a new enemy. It wasn't ants. It wasn't cycles. It wasn't even the shark tank.",
      "It was his own desk.",
      "The coach had announced a real tournament — regional, thirty problems, actual medals — six weeks out. Bob had a plan taped to his wall, a stack of practice sets sorted by difficulty, and every move from Dan's napkin drilled into his hands. He had everything.",
      "Except he couldn't sit down.",
      "Every evening went the same way. He'd walk toward his desk with real intentions. Then his brain would start negotiating. I'm a little tired. I'll start after dinner. Actually the desk is messy, I should clean it first. Actually let me check one video, just one, it's about soccer so it's basically training. And somehow it would be nine o'clock, the practice set untouched, and Bob would go to bed promising tomorrow-Bob would be a different person.",
      "Tomorrow-Bob never was.",
      "\"I don't get it,\" he told Dan on the fourth night, slumped on the porch steps. \"I know the moves now. I like the problems once I'm in them. It's like... it's like I'm a striker who can score all day in the game, but I can't make myself walk out of the locker room.\"",
      "Dan, upside-down under the bike as usual, was quiet for a second.",
      "\"Congratulations,\" he finally said. \"You found the last boss.\"",
      "\"The what?\"",
      "\"Everybody thinks the hard part of studying is the studying.\" Dan slid out and sat up. \"It isn't. The hard part is the first five seconds. Most people lose the whole battle right there — before a single problem is even on the table.\" He wiped his hands on a rag that only made them dirtier. \"Here's the thing, Bob. Homework looks like a gray wall. A wall says push harder. A game looks like a door. A door says open me and see what happens. Same math on the other side. Completely different fight to get through.\"",
      "\"So how do I turn the wall into a door?\"",
      "Dan wiped his hands one more time — pointlessly — reached into the bottom drawer of his toolbox, under the spare tubes and the wrenches, and pulled out a book.",
      "It was — no other word for it — a crazy-looking book. The cover was half torn off. The corners were round from being carried. Somebody had spilled something orange on it years ago, and at least three different pens had argued in the margins. The title, in big blocky letters that had mostly survived, read: The Secret Game of Learning.",
      "\"I found this when I was your age,\" Dan said. \"And it starts with the craziest idea I'd ever read. Everybody thinks studying is supposed to feel painful, right? Serious student, straight back, sharp pencil, miserable face. This book says that picture is a lie. It says the best learners aren't the people who suffer the most. The best learners are the people who turned studying into a game.\"",
      "He flipped it open to a page so worn it was going translucent.",
      "\"And here's the theory underneath the whole thing. Your brain does not hate learning, Bob. Your brain loves learning. It learned every Battlefield map for free. Every soccer play. Song lyrics, airsoft tactics, a hundred random animal facts — nobody forced any of that in. Your brain is a learning addict. It just refuses to get hooked on things that look like gray walls.\" He tapped the page. \"So the goal was never to become a homework robot. The goal is to build a learning system that makes your brain want to start — that gets it hooked on math the same way games hook it. The book's got seven rules for doing exactly that.\"",
      "\"Seven,\" Bob said. \"Okay. Give me the book.\"",
      "\"Nope.\" Dan grinned, and Bob knew what was coming before it came.",
      "\"You're going to need another napkin.\"",
    ],
  },
  {
    title: "Chapter 7: Three... Two... One...",
    paras: [
      "Six weeks to the tournament. The second napkin started with a countdown.",
      "Dan copied from the crazy book the way a scout copies a map — only the parts you need for the next mission.",
      "\"Hold on,\" Bob said. \"The Level-Up Rule already has rules. I know those.\"",
      "\"Different napkin, different game.\" Dan didn't look up. \"The first napkin trains you once you're already in the pool. This one gets you into the water. Seven rules, new count, starting now.\"",
      "\"Rule one,\" he said, writing. \"The 3-Second Launch. The moment you know what you should do, you count — three, two, one — and you move your body before your brain can open negotiations. Open the book. Pick up the pencil. Write the first word. Doesn't matter which. Move.\"",
      "\"That's it? Counting?\"",
      "\"That's it. Because here's the trick your brain plays on you every night: it tells you to wait until you feel ready. And 'ready' is a lie. Ready comes after starting, not before. A rocket doesn't float into space because it feels motivated. It launches because the countdown ran out.\" He tapped the napkin. \"You're the rocket. Stop waiting for the weather.\"",
      "\"Okay, but even when I do sit down,\" Bob said, \"the whole thing feels huge. 'Get ready for the tournament.' Thirty problems. Six weeks. Every topic. Where do I even—\"",
      "\"Rule two.\" Dan was already writing. \"Make the mission tiny. Never tell yourself 'study math.' Your brain hears 'study math' and pictures a mountain wearing sunglasses, laughing at you. Tell yourself 'do three problems.' 'Read one page.' 'Fix one mistake.' That's the whole mission. A game never starts by saying defeat every monster in the universe. It says pick up the sword.\"",
      "Bob looked at the napkin. Two rules. Neither of them was about math at all.",
      "That night he stood at his bedroom door, looked at the desk across the room like it was an enemy spawn point, and counted.",
      "Three. Two. One.",
      "He crossed the room before his brain finished saying maybe first you should—",
      "Mission: three problems. Not the practice set. Not the tournament. Three problems.",
      "He did five.",
    ],
  },
  {
    title: "Chapter 8: The Base",
    paras: [
      "Five weeks to the tournament. The launch worked — most nights. But Bob noticed something sneaky: even when he started, he kept leaking.",
      "His phone would buzz face-down on the desk, and even without flipping it, part of his brain would spend the next ten minutes wondering what the buzz was. His little sister's cartoon soundtrack drifted in from the living room, and part of his brain hummed along. His desk still held two comic books, a half-built Lego drone, and an airsoft magazine, and every one of them whispered his name mid-problem.",
      "He wasn't distracted for an hour at a time anymore. He was distracted thirty seconds at a time, sixty times a night. Which, he realized while doing exactly that kind of math instead of his practice set, was the same thing.",
      "\"Rule three,\" Dan said, when Bob reported the leak. \"Lock your senses. Your brain follows your eyes and ears whether you give it permission or not. If your eyes can see the phone, part of your brain is already touching it. So you don't fight the distractions — that's willpower, and willpower gets tired. You remove them. Phone in another room. Not face-down. Another. Room. One clear square of desk: book, notebook, pencil, water. Nothing else gets a visa.\"",
      "\"That sounds...\"",
      "\"Boring? It's the opposite. Think about it like this.\" Dan leaned against the porch rail. \"Every good game gives you a base. A spawn point. A place where you become the mission version of yourself the second you walk in. That's what you're building. Same seat, same clear desk, every time — and after a couple of weeks your brain learns the rule on its own: when I sit here, I hunt problems. Not the scrolling version of you. Not the sleepy version. The squad-leader version.\"",
      "Bob spent twenty minutes that night clearing his desk, and it felt like the dumbest, least mathematical training he'd ever done.",
      "Then he sat down at the clean square of wood, and it was like putting on the airsoft vest. Something in his shoulders changed. Something in his breathing changed.",
      "The base was live.",
    ],
  },
  {
    title: "Chapter 9: The Monster Book",
    paras: [
      "Four weeks to the tournament. The next upgrade Bob invented himself — although Dan claims partial credit, and honestly, the crazy book earned most of it.",
      "It started with a mistake. A dumb one. Bob dropped a negative sign in an easy problem, got it wrong, and heard the old poison sentence start up in his head: I'm bad at this. Careless. Priya would never—",
      "And then he stopped. Because that sentence, he suddenly realized, was static — the exact static he'd already beaten once this year. He wasn't bad at math. He'd been ambushed. By something small, and specific, and huntable.",
      "He grabbed the notebook and, on a fresh page, wrote:",
      {
        list: [
          "MONSTER: The Negative Sign Snake.",
          "Trick: hides in front of numbers and waits for me to rush.",
          "Weapon: circle every negative sign before solving. Every one.",
        ],
      },
      "He looked at the page. The mistake wasn't him anymore. It was a creature with a name, a known attack pattern, and a counter-move. Like every boss he'd ever beaten.",
      "By the end of the week the Monster Book had a full bestiary. The Careless Calculation Goblin, who strikes in the last step, when you can smell the answer and stop checking. The Read-Too-Fast Dragon, who eats the second half of every question. The Forgot-the-Formula Troll, big and slow and only dangerous if you never look him up. Each with a trick. Each with a weapon.",
      "\"Show me,\" Dan said, and Bob did, and Dan turned the pages slowly, grinning wider with each one.",
      "\"You know what you built, right? You jumped ahead in the book. This is rule five and rule six smashed together. Rule five: give yourself fast feedback — games hook your brain because you always know, instantly, when you scored. So draw your five boxes every night: three problems, one page, one fixed mistake — and check them off. Every check is a little ding, and dings are how a brain gets addicted to anything. But this—\" he tapped the Monster Book, \"—this is rule six, and it's the better half. A mistake is never your identity. It's an enemy. The book says 'I'm bad at this' is poison, and it's right. You don't count only correct answers, Bob. You count corrected ones. A corrected mistake isn't a failure that got erased. It's a monster on the wall.\"",
      "That night, a new line appeared in the planner — under what worked, what didn't, tomorrow's target, and move I used today:",
      "Monsters defeated.",
      "Some nights, that line was the only one with a number bigger than zero.",
      "Those turned out to be the nights he improved the most.",
    ],
  },
  {
    title: "Chapter 10: The Teacher",
    paras: [
      "Two weeks before the tournament, a new kid joined the team.",
      "His name was Theo. He was a year younger, he was there because his mom signed him up, and he sat through his first practice wearing the exact expression Bob used to see in the mirror: the frozen stare of a swimmer who has just noticed the sharks.",
      "Bob watched Theo not-solve problems for an hour, and something itched at him. After practice, he caught up with the kid at the bike racks.",
      "\"Hey. The ant one. Want to see the move?\"",
      "He didn't plan what came out next. He just started explaining — small cases, try it with three ants, watch the pattern wave at you — and then a strange thing happened, a thing Dan had never mentioned and no napkin had warned him about.",
      "Halfway through explaining, Bob found a hole in his own understanding.",
      "He knew how to shrink the problem. But when Theo asked \"okay, but how do you know when the small case is telling the truth and when it's a coincidence?\" — Bob opened his mouth and nothing came out. He'd been running that move on reflex for weeks. He'd never once asked it a question.",
      "\"That,\" said Dan, later, delighted, \"is rule four — the one we skipped, the most advanced one in the whole crazy book — and you tripped over it by accident. Switch your role. When you're only ever the student, ideas can hide in the fog — you feel like you understand, and feelings lie. The moment you become the teacher, your brain has to drag every idea out into the light and organize it. Teaching finds the fuzzy spots faster than any test.\" He raised a finger. \"And there are more roles. Get your answer wrong, become the detective: what was the hidden pattern, what clue did I miss? Finish a session, become the coach: what does this player do next time — slow down, draw first, read it twice?\"",
      "\"So it's not just doing homework anymore.\"",
      "\"It never was. You're not doing homework, Bob. You're training your own brain — and now you've got a whole squad in there to do it with.\"",
      "Bob taught Theo the small-cases move properly that week — coincidence-checking included, once he'd hunted down the answer for himself. And the ant problem, which he'd already understood, he now understood the way you understand your own street.",
      "Theo, for the record, solved two problems at the next practice, and looked at Bob the way Bob used to look at Priya.",
      "That felt better than solving ten.",
    ],
  },
  {
    title: "Chapter 11: Nine",
    paras: [
      "Tournament day. A school cafeteria two towns over, folding tables in long rows, three hundred kids, and a proctor reading rules through a microphone that crackled like a campfire.",
      "Thirty problems. Seventy-five minutes.",
      "Bob flipped the packet over at the buzzer, and problem one greeted him like an old friend — a cycle hunt, practically waving. Ding. Problem two, work backwards. Ding. Problem three...",
      "Problem three was a wall. So was four. Five he cracked with small cases. Six, wall. Seven, wall with spikes on it.",
      "And somewhere around problem ten, the truth of the room settled on him: this test was not like school tests. It was not built to be finished. It was built like a mountain — the base wide and climbable, the peak disappearing into clouds where, maybe, two kids in the whole state could breathe. It was rule seven, the last one in the crazy book, blown up to the size of a cafeteria: the perfect challenge. Not so easy your brain gets bored. Not so hard your brain wants to escape. Built to live exactly in the middle, where it whispers: you can't do this instantly — but you can figure some of it out.",
      "The old Bob — the one from the first shark-tank practice — would have heard the static rising. Everyone else is finishing. You're failing. You don't belong here.",
      "The new Bob heard the countdown instead. You can't win the whole war. Win the next three minutes. He picked his battles like a squad leader: skipped the spiked walls without shame, hunted every problem that smelled like one of his drilled moves, circled every negative sign, read every question twice with the Dragon in mind. When the Careless Calculation Goblin lunged at him in the last step of problem fourteen — he caught it. Mid-strike. Checked the arithmetic, found the slip, fixed it, and grinned like he'd blocked a shot on open goal.",
      "The scores went up on the wall an hour later, on wide printer paper, hundreds of names.",
      "Bob Reyes — nine.",
      "Nine out of thirty. His stomach dropped, the way stomachs do around numbers, before his brain could get a word in.",
      "Then his brain got a word in. He read the rest of the wall.",
      "The best score on his whole team was eleven. The best score in the entire cafeteria — three hundred kids, some of them with four years of reps — was fifteen. Out of thirty. The winner of the whole tournament had missed half the test.",
      "\"Nine,\" said Priya, appearing beside him with her own score — ten — and a face that couldn't decide whether to be annoyed or impressed. \"In your first tournament. You know what I got in my first one?\"",
      "\"Fifteen?\" Bob guessed.",
      "\"Four.\" She said it like a war medal. \"Welcome to real competition math. The test isn't asking whether you can get thirty.\" She nodded at the wall. \"It's asking how far up the mountain you've climbed so far. Nine means you're climbing fast.\"",
      "That night, Bob filled out his planner at the clean desk in his base, phone in the other room, five boxes drawn and waiting.",
      {
        list: [
          "What worked: launched on every problem, no freeze. Small cases twice, backwards twice, cycle once.",
          "What didn't: geometry walls. Three of them. Couldn't even find a door.",
          "Tomorrow's target: ask coach where the geometry doors are hidden.",
          "Move I used today: picked my battles.",
          "Monsters defeated: the Goblin, caught live, mid-strike. Best moment of the whole day.",
        ],
      },
      "Then he texted Dan a photo of the score wall, his own name circled in red, with one message underneath:",
      "\"Nine out of thirty. Best in the whole building was fifteen. I'm six away from the best there is, and I just started climbing. Also I caught the Goblin IN THE ACT. Next season they're going to need a bigger wall.\"",
      "Two doors down, a teenager looked at his phone and laughed out loud, alone, in a garage.",
      "Then he propped the phone against the toolbox and went back to the bike chain — because the kid had it now, the whole system, both napkins deep — and some things you fix, and some things you just get to watch ride away.",
      "On Sunday, Dan knocked on Bob's door with something behind his back.",
      "\"You've outgrown my napkins,\" he said, and held out the crazy book — torn cover, orange stain, three generations of arguing pens. \"It's yours now.\"",
      "Bob opened the front cover. On the inside, in faded pencil, in someone else's handwriting, it said: To Dan. Your brain already wants to learn. Build it the door. — Coach V.",
      "Bob read it twice. Then he borrowed a pencil, and right underneath, he started practicing what he'd write when it was his turn to pass it on.",
    ],
  },
  {
    title: "Your Turn: The Secret Game",
    paras: [
      "Part One gave you the Level-Up Rule: fast feedback, control, balance, and reps instead of talent. Part Two is about the fight that comes before the math — because most study battles are lost in the first five seconds, at the door of the room.",
      "Start with the crazy book's big idea, because everything else hangs from it. Most people think studying is supposed to feel painful. Wrong. Your brain does not hate learning — it loves learning. It memorized game maps, song lyrics, soccer plays, and a hundred random facts without anyone forcing it. Your brain is already an addict; it just refuses to get hooked on gray walls. So the goal is not to become a homework robot, and it is not to push harder on the wall. The goal is to build a learning system that makes your brain want to start — that gets it hooked on hard things the same way games hook it. Walls say push harder. Doors say open me and see what happens. The seven rules below are how you build doors.",
      "Here they are, straight from the book to Dan's napkin to you. They work on any subject, any deep end, starting tonight.",
      "Rule one. Use the 3-Second Launch. The hardest part of studying isn't studying — it's starting. Don't wait to feel ready; ready comes after starting. Count three, two, one, and move your body before your brain opens negotiations. You're the rocket. The countdown is the whole trick.",
      "Rule two. Make the mission tiny. Never \"study math\" — that's a mountain wearing sunglasses. Instead: three problems. One page. One fixed mistake. Don't try to win the whole war. Win the next three minutes. A game never says defeat every monster in the universe. It says pick up the sword.",
      "Rule three. Lock your senses and build a base. Your brain follows your eyes and ears. Phone in another room — not face-down, another room. One clear square of desk. Same seat every time, until your brain learns the rule by itself: when I sit here, I hunt problems.",
      "Rule four. Switch your role. Don't only be the student. Be the teacher — explain today's idea out loud, and watch it find your fuzzy spots. Be the detective — what pattern did I miss, what trick was hiding? Be the coach — what does this player do differently next time? You're not doing homework. You're training your own brain.",
      "Rule five. Give yourself fast feedback. Draw five small boxes. Check one for every tiny mission finished. Every check is a ding, and dings are what make games impossible to put down. Count corrected mistakes, not just correct answers.",
      "Rule six. Turn mistakes into monsters — never into your identity. \"I'm bad at this\" is poison. \"I found the monster\" is a hunt. Name it. Write down its trick. Write down your weapon. A corrected mistake isn't a failure that got erased — it's a head on the wall.",
      "Rule seven. Find the perfect challenge. Too easy is boring; too hard is a wall with spikes. Hunt the middle: I can't do this instantly, but I can figure it out. Warm up easy, build with medium, stretch with one hard. And when a real test hands you nine out of thirty — read the whole wall before you decide what the number means. Some tests aren't asking if you can finish the mountain. They're measuring how fast you climb.",
      "Willpower gets tired. Systems don't.",
      "So don't be the student with the straight back and the miserable face, pushing on the gray wall. Be the one who found the door — who launches on three, carries a sword sized for the next three minutes, and keeps a book full of defeated monsters by the bed.",
      "Because every tiny mission you finish teaches your brain the only sentence that matters:",
      "I can move forward.",
      "And a kid who believes that sentence, deep down, in the base, with the countdown running?",
      "That kid is not in the deep end anymore.",
      "That kid is the deep end.",
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
