"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n/provider";
import type { SearchHit } from "@/lib/search";

export function SearchBox() {
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matchLabel: Record<SearchHit["matchIn"], string> = {
    title: t.nav.matchTitle,
    summary: t.nav.matchSummary,
    content: t.nav.matchContent,
    section: t.nav.matchSection,
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const query = q.trim();
    if (!query) {
      setHits([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(query)}&limit=8`,
          );
          if (!res.ok) return;
          const data = (await res.json()) as { hits: SearchHit[] };
          setHits(data.hits);
          setOpen(true);
        } catch {
          /* ignore */
        }
      });
    }, 220);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-[11rem] sm:max-w-xs">
      <form onSubmit={submit}>
        <label className="sr-only" htmlFor="site-search">
          {t.nav.searchAria}
        </label>
        <input
          id="site-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => hits.length && setOpen(true)}
          placeholder={t.nav.searchPlaceholder}
          className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent"
          autoComplete="off"
        />
      </form>

      {open && q.trim() ? (
        <div className="absolute right-0 left-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-card shadow-lg sm:left-auto sm:w-80">
          {pending && !hits.length ? (
            <p className="px-3 py-3 text-xs text-muted">{t.nav.searchPending}</p>
          ) : hits.length === 0 ? (
            <p className="px-3 py-3 text-xs text-muted">{t.nav.searchEmpty}</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {hits.map((hit) => (
                <li key={hit.number}>
                  <Link
                    href={`/issue/${hit.number}`}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 transition hover:bg-surface"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="font-mono text-accent">#{hit.number}</span>
                      <span>{matchLabel[hit.matchIn]}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm font-medium">
                      {hit.title}
                    </p>
                    {hit.snippet ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                        {hit.snippet}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
            className="w-full border-t border-border px-3 py-2 text-left text-xs text-accent hover:bg-surface"
          >
            {t.nav.searchViewAll}
          </button>
        </div>
      ) : null}
    </div>
  );
}
