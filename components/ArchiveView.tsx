"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import type { ManifestIssue } from "@/lib/types";

export function ArchiveView({
  total,
  years,
  groups,
}: {
  total: number;
  years: string[];
  groups: Record<string, ManifestIssue[]>;
}) {
  const { t, tf } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{t.archive.title}</h1>
      <p className="mt-2 text-muted">
        {tf(t.archive.subtitle, { total })}
      </p>

      <div className="mt-12 space-y-12">
        {years.map((year) => (
          <section key={year}>
            <h2 className="mb-4 text-lg font-semibold text-accent">{year}</h2>
            <ol className="relative space-y-0 border-l border-border pl-6">
              {groups[year].map((issue) => (
                <li key={issue.number} className="relative pb-5">
                  <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background" />
                  <Link
                    href={`/issue/${issue.number}`}
                    className="group block"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-xs text-muted">
                        #{issue.number}
                      </span>
                      <time
                        dateTime={issue.date}
                        className="text-xs text-muted"
                      >
                        {issue.date}
                      </time>
                    </div>
                    <p className="mt-0.5 text-[15px] font-medium transition group-hover:text-accent">
                      {issue.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
