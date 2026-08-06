import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IssueView } from "@/components/IssueView";
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
  if (!issue) return { title: "Not found" };
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

  return <IssueView issue={issue} prev={prev} next={next} />;
}
