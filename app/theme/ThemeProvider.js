"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "sh-ledger-theme";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // ignore (private browsing etc.)
    }
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
