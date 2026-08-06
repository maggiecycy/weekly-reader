"use client";

import { useState, useTransition } from "react";
import { PAGE_SIZE } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/provider";
import type { ManifestIssue } from "@/lib/types";
import { IssueCard } from "./IssueCard";

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[16/9] bg-surface" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-24 rounded bg-surface" />
        <div className="h-5 w-3/4 rounded bg-surface" />
        <div className="h-4 w-full rounded bg-surface" />
      </div>
    </div>
  );
}

export function LoadMore({
  initialIssues,
  total,
}: {
  initialIssues: ManifestIssue[];
  total: number;
}) {
  const { t, tf } = useI18n();
  const [issues, setIssues] = useState(initialIssues);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const hasMore = issues.length < total;

  const loadMore = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/issues?offset=${issues.length}&limit=${PAGE_SIZE}`,
        );
        if (!res.ok) throw new Error("fail");
        const data = (await res.json()) as { issues: ManifestIssue[] };
        setIssues((prev) => [...prev, ...data.issues]);
      } catch {
        setError(t.loadMore.error);
      }
    });
  };

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        {issues.map((issue) => (
          <IssueCard key={issue.number} issue={issue} />
        ))}
        {pending
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={`sk-${i}`} />
            ))
          : null}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={pending}
            className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? t.loadMore.loading : t.loadMore.button}
          </button>
        ) : (
          <p className="text-sm text-muted">
            {tf(t.loadMore.done, { n: total })}
          </p>
        )}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}
