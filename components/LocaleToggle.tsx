"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LocaleToggle() {
  const { locale, setLocale, t } = useI18n();

  const set = (next: Locale) => {
    if (next !== locale) setLocale(next);
  };

  return (
    <div
      className="inline-flex h-9 items-center rounded-lg border border-border bg-card p-0.5 text-xs font-medium"
      role="group"
      aria-label={t.locale.label}
    >
      <button
        type="button"
        onClick={() => set("zh")}
        className={`rounded-md px-2 py-1 transition ${
          locale === "zh"
            ? "bg-foreground text-background"
            : "text-muted hover:text-foreground"
        }`}
        aria-pressed={locale === "zh"}
      >
        {t.locale.switchToZh}
      </button>
      <button
        type="button"
        onClick={() => set("en")}
        className={`rounded-md px-2 py-1 transition ${
          locale === "en"
            ? "bg-foreground text-background"
            : "text-muted hover:text-foreground"
        }`}
        aria-pressed={locale === "en"}
      >
        {t.locale.switchToEn}
      </button>
    </div>
  );
}
