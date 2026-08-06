"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import type { ManifestIssue } from "@/lib/types";

function formatDate(date: string) {
  if (!date) return "";
  return date.slice(0, 10);
}

export function IssueCard({ issue }: { issue: ManifestIssue }) {
  const { t } = useI18n();

  return (
    <Link
      href={`/issue/${issue.number}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition duration-200 hover:border-accent/40 hover:shadow-sm"
    >
      {issue.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={issue.coverImage}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-surface text-sm text-muted">
          {t.card.noCover}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="rounded-md bg-accent-soft px-2 py-0.5 font-mono font-medium text-accent">
            #{issue.number}
          </span>
          <time dateTime={issue.date}>{formatDate(issue.date)}</time>
        </div>
        <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-foreground transition group-hover:text-accent">
          {issue.title}
        </h2>
        {issue.summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {issue.summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
