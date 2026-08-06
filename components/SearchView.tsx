"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import type { SearchHit } from "@/lib/search";

export function SearchView({
  query,
  hits,
}: {
  query: string;
  hits: SearchHit[];
}) {
  const { t, tf } = useI18n();

  const matchLabel = {
    title: t.nav.matchTitle,
    summary: t.nav.matchSummary,
    content: t.nav.matchContent,
    section: t.nav.matchSection,
  } as const;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{t.search.title}</h1>
      <form action="/search" method="get" className="mt-6">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={t.nav.searchPlaceholder}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
          autoFocus
        />
      </form>

      {query ? (
        <p className="mt-4 text-sm text-muted">
          {tf(t.search.results, { q: query, n: hits.length })}
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">{t.search.hint}</p>
      )}

      <ul className="mt-8 space-y-4">
        {hits.map((hit) => (
          <li key={hit.number}>
            <Link
              href={`/issue/${hit.number}`}
              className="group block rounded-xl border border-border bg-card p-4 transition hover:border-accent/40"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-accent">
                  #{hit.number}
                </span>
                <time dateTime={hit.date}>{hit.date}</time>
                <span>
                  ·{" "}
                  {tf(t.search.match, { type: matchLabel[hit.matchIn] })}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">
                {hit.title}
              </h2>
              {hit.snippet ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {hit.snippet}
                </p>
              ) : hit.summary ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {hit.summary}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
