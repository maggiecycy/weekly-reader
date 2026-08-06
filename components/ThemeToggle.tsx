"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

type Theme = "light" | "dark";

function getPreferred(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const next = getPreferred();
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="h-9 w-9 rounded-lg border border-border bg-card"
        aria-label={t.theme.toggle}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-sm text-muted transition hover:border-accent hover:text-foreground"
      aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}
      title={theme === "dark" ? t.theme.light : t.theme.dark}
    >
      {theme === "dark" ? t.theme.lightShort : t.theme.darkShort}
    </button>
  );
}
