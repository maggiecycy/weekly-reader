import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IssueContent } from "@/components/IssueContent";
import { AUTHOR_NAME } from "@/lib/constants";
import { getAdjacentIssues, getAllIssueNumbers, getIssue } from "@/lib/issues";

type Props = { params: Promise<{ number: string }> };

export function generateStaticParams() {
  return getAllIssueNumbers().map((number) => ({
    number: String(number),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number: raw } = await params;
  const issue = getIssue(Number(raw));
  if (!issue) return { title: "未找到" };
  return {
    title: `#${issue.number} ${issue.title}`,
    description: issue.summary,
  };
}

export default async function IssuePage({ params }: Props) {
  const { number: raw } = await params;
  const number = Number(raw);
  if (!Number.isFinite(number)) notFound();

  const issue = getIssue(number);
  if (!issue) notFound();

  const { prev, next } = getAdjacentIssues(number);

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mx-auto max-w-[720px]">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-md bg-accent-soft px-2.5 py-1 font-mono font-medium text-accent">
            #{issue.number}
          </span>
          <time dateTime={issue.date} className="text-muted">
            {issue.date}
          </time>
          <span className="text-muted">·</span>
          <span className="text-muted">作者 {AUTHOR_NAME}</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {issue.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={issue.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            阅读原文（ruanyifeng.com）
          </a>
          <a
            href={issue.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition hover:border-accent"
          >
            GitHub Markdown
          </a>
        </div>
      </header>

      <div className="mx-auto mt-12 max-w-[920px]">
        <IssueContent issue={issue} />
      </div>

      <nav className="mx-auto mt-16 flex max-w-[720px] items-stretch justify-between gap-4 border-t border-border pt-8">
        {prev ? (
          <Link
            href={`/issue/${prev.number}`}
            className="group flex-1 rounded-xl border border-border bg-card p-4 transition hover:border-accent"
          >
            <p className="text-xs text-muted">上一期</p>
            <p className="mt-1 text-sm font-medium group-hover:text-accent">
              #{prev.number} {prev.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/issue/${next.number}`}
            className="group flex-1 rounded-xl border border-border bg-card p-4 text-right transition hover:border-accent"
          >
            <p className="text-xs text-muted">下一期</p>
            <p className="mt-1 text-sm font-medium group-hover:text-accent">
              #{next.number} {next.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </nav>
    </article>
  );
}
