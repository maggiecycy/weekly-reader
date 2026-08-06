"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { SearchHit } from "@/lib/search";

const MATCH_LABEL: Record<SearchHit["matchIn"], string> = {
  title: "标题",
  summary: "摘要",
  content: "正文",
  section: "栏目",
};

export function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div ref={wrapRef} className="relative w-full max-w-xs">
      <form onSubmit={submit}>
        <label className="sr-only" htmlFor="site-search">
          搜索周刊
        </label>
        <input
          id="site-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => hits.length && setOpen(true)}
          placeholder="搜索期号 / 标题 / 关键词…"
          className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-accent"
          autoComplete="off"
        />
      </form>

      {open && q.trim() ? (
        <div className="absolute right-0 left-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {pending && !hits.length ? (
            <p className="px-3 py-3 text-xs text-muted">搜索中…</p>
          ) : hits.length === 0 ? (
            <p className="px-3 py-3 text-xs text-muted">无匹配结果</p>
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
                      <span>{MATCH_LABEL[hit.matchIn]}</span>
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
            查看全部结果 →
          </button>
        </div>
      ) : null}
    </div>
  );
}
