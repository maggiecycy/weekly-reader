"use client";

import { useState, useTransition } from "react";
import type { ManifestIssue } from "@/lib/types";
import { IssueCard } from "./IssueCard";
import { PAGE_SIZE } from "@/lib/constants";

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
        if (!res.ok) throw new Error("加载失败");
        const data = (await res.json()) as { issues: ManifestIssue[] };
        setIssues((prev) => [...prev, ...data.issues]);
      } catch {
        setError("加载失败，请稍后重试");
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
            {pending ? "加载中…" : "加载更多往期"}
          </button>
        ) : (
          <p className="text-sm text-muted">已加载全部 {total} 期</p>
        )}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}
