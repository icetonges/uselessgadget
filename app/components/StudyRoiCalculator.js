"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./StudyRoiCalculator.module.css";

const DEFAULTS = { r: 10, n: 40, s: 30, w: 50, e: 20 };

function formatPercent(rr) {
  return (
    rr.toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
    }) + "/yr"
  );
}

export default function StudyRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS);
  const canvasRef = useRef(null);

  const rr = parseFloat(values.r) / 100;
  const nn = parseFloat(values.n);
  const ss = parseFloat(values.s);
  const ww = parseFloat(values.w);
  const ee = 1 + parseFloat(values.e) / 100;

  const fv = ss * Math.pow(1 + rr, nn);
  const rawHours = fv / ww;
  const finalHours = rawHours * ee;

  const fvStr = fv.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const finalHoursStr = finalHours.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });

  const formulaText = `FV                = StudyValue × (1 + r)^Years
                  = $${ss} × (1 + ${rr.toFixed(3)})^${nn}
                  = $${fvStr}

FreeHoursReturned = (FV ÷ ValueOfFreeHour) × EfficiencyBonus
                  = ($${fvStr} ÷ $${ww}) × ${ee.toFixed(2)}
                  = ${finalHours.toFixed(1)} hours

ROI ratio         = ${finalHours.toFixed(1)} : 1`;

  function handleChange(key) {
    return (e) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }

  function drawChart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = 180 * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const W = rect.width,
      H = 180;
    ctx.clearRect(0, 0, W, H);

    const padL = 44,
      padR = 10,
      padT = 14,
      padB = 24;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const points = [];
    for (let y = 0; y <= nn; y++) {
      points.push(ss * Math.pow(1 + rr, y));
    }
    const maxV = points[points.length - 1];

    // axes
    ctx.strokeStyle = "#c9bfa8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // gridlines + y labels
    ctx.fillStyle = "#7a7a6c";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 3; i++) {
      const val = (maxV * i) / 3;
      const yy = padT + plotH - (val / maxV) * plotH;
      ctx.strokeStyle = "#ded5c0";
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(padL + plotW, yy);
      ctx.stroke();
      ctx.fillText("$" + Math.round(val).toLocaleString(), padL - 6, yy + 3);
    }

    // curve
    ctx.strokeStyle = "#a8823a";
    ctx.lineWidth = 2.5;
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
    ctx.fillStyle = "rgba(168,130,58,0.12)";
    ctx.fill();

    // x labels
    ctx.fillStyle = "#7a7a6c";
    ctx.textAlign = "center";
    ctx.fillText("year 0", padL, padT + plotH + 16);
    ctx.fillText("year " + nn, padL + plotW, padT + plotH + 16);
  }

  useEffect(() => {
    drawChart();
    const onResize = () => drawChart();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rr, nn, ss]);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          Illustrative model &middot; not financial advice
        </div>
        <h1 className={styles.h1}>The Study-Hour Ledger</h1>
        <div className={styles.sub}>
          One hour of focused, active learning today, compounded like a small
          investment, cashed out later as hours of free time. Move the
          sliders — the ratio is far more sensitive to <em>when</em> you
          start than to <em>how much</em> you do.
        </div>
      </header>

      <div className={styles.result}>
        <div className={styles.resultLabel}>Return on 1 hour of study</div>
        <div className={styles.resultNum}>
          {finalHoursStr}{" "}
          <span className={styles.unit}>hours of free time, later in life</span>
        </div>
        <div className={styles.resultFoot}>
          ${ss} compounds to ${fvStr} over {nn} years →{" "}
          {rawHours.toFixed(1)} hrs bought back → {finalHours.toFixed(1)}{" "}
          hrs with the efficiency bonus
        </div>
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
            <span className={styles.fieldName}>Years to peak payoff (N)</span>
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
            A rough stand-in for the &quot;cost basis&quot; — what a quality
            hour of tutoring/deliberate instruction is worth.
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
            What an hour of your adult time is worth — used to convert the
            compounded dollar value into hours you don&rsquo;t have to work.
          </div>
          <input
            className={styles.range}
            type="range"
            min="15"
            max="150"
            step="1"
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
            Skilled, disciplined adults finish the same work in less time and
            avoid costly mistakes/redos — this multiplies the raw payoff.
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
          Value of a single study hour, growing at rate r, year by year to
          the payoff year.
        </div>
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
      </div>

      <div className={styles.formula}>
        <h2>The formula</h2>
        <code className={styles.formulaCode}>{formulaText}</code>
      </div>

      <div className={styles.sourcesBox}>
        Grounding data: Heckman Equation research on early-learning ROI
        (7–13%/yr); Georgetown CEW / SSA / Federal Reserve research on the
        college wage premium (roughly $450K–$1.1M lifetime, ~75–86% higher
        annual earnings). Everything else — the $/hour of study, the value
        of a future free hour, the efficiency bonus — is a deliberately
        adjustable assumption, not a measured fact. Treat the output as an
        order-of-magnitude story about compounding, not a literal
        prediction.
      </div>
      <div className={styles.caveat}>
        The real driver in this model isn&rsquo;t total hours studied —
        it&rsquo;s the compounding rate and how early it starts. Ten years
        of head start matters more than doubling the hours.
      </div>
    </div>
  );
}
