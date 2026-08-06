import Link from "next/link";
import type { Metadata } from "next";
import { searchIssues } from "@/lib/search";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `搜索：${q}` : "搜索",
  };
}

const MATCH_LABEL = {
  title: "标题",
  summary: "摘要",
  content: "正文",
  section: "栏目",
} as const;

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const hits = query ? searchIssues(query, 50) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">搜索</h1>
      <form action="/search" method="get" className="mt-6">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="搜索期号 / 标题 / 关键词…"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
          autoFocus
        />
      </form>

      {query ? (
        <p className="mt-4 text-sm text-muted">
          「{query}」共 {hits.length} 条结果
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">输入关键词检索已同步的周刊内容</p>
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
                <span>· 匹配 {MATCH_LABEL[hit.matchIn]}</span>
              </div>
              <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">
                {hit.title}
              </h2>
              {hit.snippet ? (
                <p className="mt-1 text-sm text-muted line-clamp-2">{hit.snippet}</p>
              ) : hit.summary ? (
                <p className="mt-1 text-sm text-muted line-clamp-2">{hit.summary}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
