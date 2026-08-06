"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import type { Section } from "@/lib/types";

function TocList({
  sections,
  active,
  onNavigate,
}: {
  sections: Section[];
  active: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-1.5 text-sm">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={onNavigate}
            className={`block truncate rounded-md px-2 py-1 transition ${
              active === s.id
                ? "bg-accent-soft text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {s.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function useActiveSection(sections: Section[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return active;
}

/** Mobile accordion TOC */
export function MobileToc({ sections }: { sections: Section[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sections);

  if (!sections.length) return null;

  return (
    <div className="mb-8 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium"
      >
        {t.issue.toc}
        <span className="text-muted">
          {open ? t.issue.tocCollapse : t.issue.tocExpand}
        </span>
      </button>
      {open ? (
        <div className="mt-2 rounded-xl border border-border bg-card p-3">
          <TocList
            sections={sections}
            active={active}
            onNavigate={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Desktop sticky TOC */
export function DesktopToc({ sections }: { sections: Section[] }) {
  const { t } = useI18n();
  const active = useActiveSection(sections);

  if (!sections.length) return null;

  return (
    <aside className="sticky top-20 max-h-[calc(100vh-5.5rem)] self-start overflow-y-auto pb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        {t.issue.toc}
      </p>
      <TocList sections={sections} active={active} />
    </aside>
  );
}
