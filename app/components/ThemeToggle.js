"use client";

import { useTheme } from "../theme/ThemeProvider";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      data-mounted={mounted}
    >
      <span className={styles.iconSun} aria-hidden="true">☀️</span>
      <span className={styles.iconMoon} aria-hidden="true">🌙</span>
      <span
        className={styles.thumb}
        data-pos={isDark ? "right" : "left"}
        aria-hidden="true"
      />
    </button>
  );
}
