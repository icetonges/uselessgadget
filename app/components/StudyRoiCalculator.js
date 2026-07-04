"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useTheme } from "../theme/ThemeProvider";
import ThemeToggle from "./ThemeToggle";
import styles from "./StudyRoiCalculator.module.css";

const DEFAULTS = { r: 10, n: 40, s: 30, w: 50, e: 20 };

const MILESTONES = [
  10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000,
];

const BASE_RATE = 50; // reference wage ($/hr) — the slider's lower bound
const REF_COST = 30; // reference cost ($/hr) — matches the slider's default

function calc(values) {
  const rr = parseFloat(values.r) / 100;
  const nn = parseFloat(values.n);
  const ss = parseFloat(values.s);
  const ww = parseFloat(values.w);
  const ee = 1 + parseFloat(values.e) / 100;

  // The intrinsic future value of one genuinely focused hour compounds on
  // its own — it doesn't depend on what you happened to pay for it today.
  // What ss (market value/cost of a study hour) changes is how good a deal
  // you got: paying less than the reference cost is a bargain and should
  // return proportionally MORE hours; paying more is a worse deal and
  // should return proportionally fewer.
  const fv = REF_COST * Math.pow(1 + rr, nn);
  const costRatio = REF_COST / ss;

  // Hours of freedom at a flat baseline wage, then amplified by how much
  // more valuable your future hour is than that baseline. A higher personal
  // rate means less work is needed to cover the same bills, so it should
  // scale the payoff up, not divide it away.
  const baseHours = (fv / BASE_RATE) * costRatio;
  const leverage = ww / BASE_RATE;
  const rawHours = baseHours * leverage;
  const finalHours = rawHours * ee;

  return {
    rr, nn, ss, ww, ee, fv, costRatio, baseHours, leverage, rawHours, finalHours,
  };
}

function magnitudeEmoji(h) {
  if (h >= 5000) return "👑";
  if (h >= 1000) return "🚀";
  if (h >= 250) return "💎";
  if (h >= 50) return "📈";
  return "📚";
}

function formatPercent(rr) {
  return (
    rr.toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
    }) + "/yr"
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useAnimatedNumber(target, duration) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(null);

  useEffect(() => {
    if (duration <= 0) {
      setDisplay(target);
      fromRef.current = target;
      return undefined;
    }
    const from = fromRef.current;
    const delta = target - from;
    if (Math.abs(delta) < 0.005) {
      setDisplay(target);
      fromRef.current = target;
      return undefined;
    }
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + delta * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

export default function StudyRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS);
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();

  const {
    rr, nn, ss, ww, ee, fv, costRatio, baseHours, leverage, rawHours, finalHours,
  } = calc(values);

  const animatedFinalHours = useAnimatedNumber(
    finalHours,
    reducedMotion ? 0 : 650
  );

  const fvStr = fv.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const displayHoursStr = animatedFinalHours.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });

  function handleChange(key) {
    return (e) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }

  // ---- confetti -----------------------------------------------------
  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const fireConfetti = useCallback((big = false) => {
    if (reducedMotionRef.current) return;
    const isDark = themeRef.current === "dark";
    const palette = isDark
      ? ["#f3b559", "#5be0b6", "#4fd1ae", "#ffffff"]
      : ["#9c7530", "#256b57", "#2f7c68", "#1c2b2b"];

    confetti({
      particleCount: big ? 140 : 60,
      spread: big ? 100 : 70,
      startVelocity: big ? 48 : 32,
      origin: { y: 0.3 },
      colors: palette,
      scalar: big ? 1.1 : 0.9,
      ticks: 230,
    });

    if (big) {
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.4 },
          colors: palette,
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.4 },
          colors: palette,
        });
      }, 150);
    }
  }, []);

  // entrance celebration, once
  useEffect(() => {
    const t = setTimeout(() => fireConfetti(false), 550);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // milestone celebrations
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const bestMilestoneRef = useRef(
    MILESTONES.filter((m) => m <= calc(DEFAULTS).finalHours).pop() || 0
  );

  useEffect(() => {
    const crossed = MILESTONES.filter(
      (m) => finalHours >= m && m > bestMilestoneRef.current
    );
    if (crossed.length) {
      const top = crossed[crossed.length - 1];
      bestMilestoneRef.current = top;
      fireConfetti(top >= 1000);
      setToast(`🏆 Milestone unlocked — ${top.toLocaleString()}+ hours returned!`);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalHours]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ---- chart ----------------------------------------------------------
  function getVar(name, fallback) {
    if (typeof window === "undefined") return fallback;
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return v || fallback;
  }

  function drawChart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = 180 * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const W = rect.width,
      H = 180;
    ctx.clearRect(0, 0, W, H);

    const lineColor = getVar("--line", "#c9bfa8");
    const mutedColor = getVar("--muted", "#7a7a6c");
    const goldColor = getVar("--gold", "#a8823a");

    const padL = 52,
      padR = 10,
      padT = 14,
      padB = 24;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const points = [];
    for (let y = 0; y <= nn; y++) {
      points.push(REF_COST * Math.pow(1 + rr, y));
    }
    const maxV = points[points.length - 1];

    // axes
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // gridlines + y labels
    ctx.fillStyle = mutedColor;
    ctx.font = "13px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 3; i++) {
      const val = (maxV * i) / 3;
      const yy = padT + plotH - (val / maxV) * plotH;
      ctx.strokeStyle = lineColor;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(padL + plotW, yy);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillText("$" + Math.round(val).toLocaleString(), padL - 8, yy + 4);
    }

    // curve
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = padL + (i / nn) * plotW;
      const yy = padT + plotH - (p / maxV) * plotH;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    });
    ctx.stroke();

    // fill under curve
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.lineTo(padL, padT + plotH);
    ctx.closePath();
    ctx.fillStyle = goldColor;
    ctx.globalAlpha = 0.14;
    ctx.fill();
    ctx.globalAlpha = 1;

    // x labels
    ctx.fillStyle = mutedColor;
    ctx.textAlign = "center";
    ctx.fillText("year 0", padL, padT + plotH + 18);
    ctx.fillText("year " + nn, padL + plotW, padT + plotH + 18);
  }

  useEffect(() => {
    drawChart();
    const onResize = () => drawChart();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rr, nn, ss, theme]);

  const emoji = useMemo(() => magnitudeEmoji(finalHours), [finalHours]);

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <ThemeToggle />
          </div>
          <h1 className={styles.h1}>The Study-Hour Ledger</h1>
          <div className={styles.tagline}>
            Instead of treating your best hour like an expense — spent,
            then gone — treat it like a seed. Research on early learning
            suggests focused effort compounds quietly for decades before it
            pays out as <em>freedom</em>, not just skill. Adjust the five
            levers below to see exactly how much timing matters.
          </div>
        </header>

        <div className={styles.result}>
          <div className={styles.resultLabel}>Return on 1 hour of study</div>
          <div className={styles.resultNum}>
            <span className={styles.badge} aria-hidden="true">
              {emoji}
            </span>
            <span className={styles.num}>{displayHoursStr}</span>
            <span className={styles.unit}>
              hours of free time, later in life
            </span>
          </div>
          <div className={styles.resultFoot}>
            ${fvStr} intrinsic value over {nn} years →{" "}
            &times;{costRatio.toFixed(2)} for paying ${ss}/hr instead of
            the ${REF_COST}/hr reference, &times;{leverage.toFixed(1)} for
            your ${ww}/hr rate → {finalHours.toFixed(1)} hrs with the
            efficiency bonus
          </div>
          <button
            type="button"
            className={styles.celebrateBtn}
            onClick={() => fireConfetti(true)}
          >
            🎉 Celebrate this ratio
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.field}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldName}>
                Annual compounding rate (r)
              </span>
              <span className={styles.fieldVal}>{formatPercent(rr)}</span>
            </div>
            <div className={styles.fieldNote}>
              Heckman&rsquo;s research finds 7–10%/yr for preschool-age
              programs, up to 13%/yr for high-quality birth-to-five learning.
              Earlier + higher-quality learning compounds faster.
            </div>
            <input
              className={styles.range}
              type="range"
              min="4"
              max="16"
              step="0.5"
              value={values.r}
              onChange={handleChange("r")}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldName}>
                Years to peak payoff (N)
              </span>
              <span className={styles.fieldVal}>{nn} yrs</span>
            </div>
            <div className={styles.fieldNote}>
              Time from when the study hour happens (say, age 10) to when
              it&rsquo;s &quot;cashed out&quot; in peak earning /
              wealth-building years.
            </div>
            <input
              className={styles.range}
              type="range"
              min="15"
              max="55"
              step="1"
              value={values.n}
              onChange={handleChange("n")}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldName}>
                Market value of 1 study hour today
              </span>
              <span className={styles.fieldVal}>${ss}/hr</span>
            </div>
            <div className={styles.fieldNote}>
              What it costs to get a genuinely focused hour today —
              tutoring, materials, or your own opportunity cost. Pay less
              than the reference cost and the same future payoff returns
              proportionally more hours; pay more, and it returns less.
            </div>
            <input
              className={styles.range}
              type="range"
              min="10"
              max="80"
              step="1"
              value={values.s}
              onChange={handleChange("s")}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldName}>
                Value of your future free hour
              </span>
              <span className={styles.fieldVal}>${ww}/hr</span>
            </div>
            <div className={styles.fieldNote}>
              What an hour of your future time is worth. The higher your
              personal rate, the fewer hours you need to work to cover your
              life — so the same study investment converts into
              proportionally more hours of freedom, not fewer.
            </div>
            <input
              className={styles.range}
              type="range"
              min="50"
              max="5000"
              step="10"
              value={values.w}
              onChange={handleChange("w")}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldName}>
                Efficiency + character bonus
              </span>
              <span className={styles.fieldVal}>&times;{ee.toFixed(2)}</span>
            </div>
            <div className={styles.fieldNote}>
              Skilled, disciplined adults finish the same work in less time
              and avoid costly mistakes/redos — this multiplies the raw
              payoff.
            </div>
            <input
              className={styles.range}
              type="range"
              min="0"
              max="60"
              step="5"
              value={values.e}
              onChange={handleChange("e")}
            />
          </div>
        </div>

        <div className={styles.chartbox}>
          <h2>How the value compounds over time</h2>
          <div className={styles.chartNote}>
            Intrinsic value of one focused hour, growing at rate r, year by
            year to the payoff year — independent of what you pay for it.
          </div>
          <canvas ref={canvasRef} className={styles.canvas}></canvas>
        </div>

        <div className={styles.story}>
          On the drive to physical therapy — after a full day of camp for
          him and work for me — I noticed he&rsquo;d gone quiet. It
          reminded me of something he&rsquo;d said the day before: he was
          tired of camp, tired of summer break looking the same every
          year, and he wanted this one to be different. While he was in
          his session, I stopped rehearsing what to say and started
          building something instead — a calculator that could show, not
          tell, why an early hour is <em>the best investment</em> you can
          make. On the way home, I skipped the lecture and just handed him
          my phone. We watched the numbers together: how doubling your
          hours at forty barely moves the needle, but the same single
          hour invested at ten has decades left to compound. That&rsquo;s
          the strange thing about time — spend it early on something
          real, and it quietly buys you more of itself later: fewer
          redos, faster decisions, Saturdays that are actually yours
          instead of spent catching up. He didn&rsquo;t say much, but
          something shifted — the question wasn&rsquo;t <em>why</em>{" "}
          anymore, it was <em>when</em> he could start. This calculator is
          that afternoon turned into sliders — move them and watch the
          return on a single hour of study shift dramatically, not
          because you did more, but because of <em>when</em> you did it.
        </div>

      </div>

      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
