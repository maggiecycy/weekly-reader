"use client";

import { AUTHOR_NAME, SOURCE_REPO } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/provider";

export function SiteFooter() {
  const { t, tf } = useI18n();

  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm leading-relaxed text-muted">
          {tf(t.footer.byline, { author: AUTHOR_NAME })
            .split(/(ruanyifeng\.com|ruanyf\/weekly)/)
            .map((part, i) => {
              if (part === "ruanyifeng.com") {
                return (
                  <a
                    key={i}
                    href="https://www.ruanyifeng.com/blog/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    ruanyifeng.com
                  </a>
                );
              }
              if (part === "ruanyf/weekly") {
                return (
                  <a
                    key={i}
                    href={SOURCE_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    ruanyf/weekly
                  </a>
                );
              }
              return <span key={i}>{part}</span>;
            })}
        </p>
        <p className="mt-2 text-sm text-muted">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
