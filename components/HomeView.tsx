"use client";

import Link from "next/link";
import { PAGE_SIZE, SITE_NAME, SOURCE_REPO } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/provider";
import type { Manifest } from "@/lib/types";
import { LoadMore } from "./LoadMore";

export function HomeView({
  manifest,
}: {
  manifest: Pick<Manifest, "latest" | "total" | "syncedAt" | "issues">;
}) {
  const { t, tf } = useI18n();
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
            {t.home.badge}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {t.home.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={manifest.latest ? `/issue/${manifest.latest}` : "/archive"}
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
            >
              {t.home.readLatest}
            </Link>
            <a
              href={SOURCE_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:border-accent"
            >
              {t.home.githubRepo}
            </a>
          </div>
          {manifest.total > 0 ? (
            <p className="mt-6 text-xs text-muted">
              {tf(t.home.synced, {
                total: manifest.total,
                latest: manifest.latest,
              })}
              {manifest.syncedAt
                ? tf(t.home.syncedAt, {
                    date: manifest.syncedAt.slice(0, 10),
                  })
                : ""}
            </p>
          ) : (
            <p className="mt-6 text-sm text-muted">{t.home.empty}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t.home.latestTitle}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {tf(t.home.latestHint, { n: PAGE_SIZE })}
            </p>
          </div>
          <Link href="/archive" className="text-sm text-accent hover:underline">
            {t.home.viewArchive}
          </Link>
        </div>

        {initial.length > 0 ? (
          <LoadMore initialIssues={initial} total={manifest.total} />
        ) : null}
      </section>
    </div>
  );
}
