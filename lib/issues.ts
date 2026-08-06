import fs from "fs";
import path from "path";
import type { Manifest, ManifestIssue, WeeklyIssue } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ISSUES_DIR = path.join(CONTENT_DIR, "issues");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

export function getManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      latest: 0,
      syncedAt: "",
      total: 0,
      issues: [],
    };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")) as Manifest;
}

export function getIssue(number: number): WeeklyIssue | null {
  const file = path.join(ISSUES_DIR, `${number}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as WeeklyIssue;
}

export function getAllIssueNumbers(): number[] {
  return getManifest()
    .issues.map((i) => i.number)
    .sort((a, b) => b - a);
}

export function getLatestIssues(limit: number): ManifestIssue[] {
  return getManifest().issues.slice(0, limit);
}

export function getIssuesPage(offset: number, limit: number): ManifestIssue[] {
  return getManifest().issues.slice(offset, offset + limit);
}

export function getAdjacentIssues(number: number): {
  prev: ManifestIssue | null;
  next: ManifestIssue | null;
} {
  const issues = getManifest().issues;
  const idx = issues.findIndex((i) => i.number === number);
  if (idx < 0) return { prev: null, next: null };
  // issues sorted desc: next = newer = idx-1, prev = older = idx+1
  return {
    next: idx > 0 ? issues[idx - 1] : null,
    prev: idx < issues.length - 1 ? issues[idx + 1] : null,
  };
}

export function groupIssuesByYear(
  issues: ManifestIssue[],
): Record<string, ManifestIssue[]> {
  const groups: Record<string, ManifestIssue[]> = {};
  for (const issue of issues) {
    const year = (issue.date || "未知").slice(0, 4);
    if (!groups[year]) groups[year] = [];
    groups[year].push(issue);
  }
  return groups;
}
