import Link from "next/link";
import { LoadMore } from "@/components/LoadMore";
import {
  PAGE_SIZE,
  SITE_NAME,
  SITE_TAGLINE,
  SOURCE_REPO,
} from "@/lib/constants";
import { getManifest } from "@/lib/issues";

export default function HomePage() {
  const manifest = getManifest();
  const initial = manifest.issues.slice(0, PAGE_SIZE);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, var(--accent-soft), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-medium tracking-wide text-accent">
            个人阅读器
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {SITE_TAGLINE}
            。重新排版阮一峰「科技爱好者周刊」，保留原文链接与署名。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={
                manifest.latest ? `/issue/${manifest.latest}` : "/archive"
              }
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
            >
              阅读最新一期
            </Link>
            <a
              href={SOURCE_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:border-accent"
            >
              GitHub 原仓库
            </a>
          </div>
          {manifest.total > 0 ? (
            <p className="mt-6 text-xs text-muted">
              已同步 {manifest.total} 期 · 最新 #{manifest.latest}
              {manifest.syncedAt
                ? ` · 同步于 ${manifest.syncedAt.slice(0, 10)}`
                : ""}
            </p>
          ) : (
            <p className="mt-6 text-sm text-muted">
              暂无数据。请先运行{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                npm run sync
              </code>
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">最新周刊</h2>
            <p className="mt-1 text-sm text-muted">
              默认展示最近 {PAGE_SIZE} 期，点击加载更多
            </p>
          </div>
          <Link
            href="/archive"
            className="text-sm text-accent hover:underline"
          >
            查看归档 →
          </Link>
        </div>

        {initial.length > 0 ? (
          <LoadMore initialIssues={initial} total={manifest.total} />
        ) : null}
      </section>
    </div>
  );
}
