import { getIssue, getManifest } from "./issues";
import type { ManifestIssue } from "./types";

export interface SearchHit {
  number: number;
  title: string;
  date: string;
  summary?: string;
  coverImage?: string;
  sourceUrl: string;
  /** Where the match was found */
  matchIn: "title" | "summary" | "content" | "section";
  snippet?: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function includesIgnoreCase(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function makeSnippet(text: string, query: string, radius = 40): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx < 0) return text.slice(0, radius * 2) + (text.length > radius * 2 ? "…" : "");
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + query.length + radius);
  return (
    (start > 0 ? "…" : "") +
    text.slice(start, end) +
    (end < text.length ? "…" : "")
  );
}

/** Full-text search across synced issues (title / summary / body). */
export function searchIssues(query: string, limit = 30): SearchHit[] {
  const q = query.trim();
  if (!q || q.length < 1) return [];

  const manifest = getManifest();
  const hits: SearchHit[] = [];
  const seen = new Set<number>();

  const push = (issue: ManifestIssue, matchIn: SearchHit["matchIn"], snippet?: string) => {
    if (seen.has(issue.number)) return;
    seen.add(issue.number);
    hits.push({
      number: issue.number,
      title: issue.title,
      date: issue.date,
      summary: issue.summary,
      coverImage: issue.coverImage,
      sourceUrl: issue.sourceUrl,
      matchIn,
      snippet,
    });
  };

  // 1) Fast path: title / summary / period number
  for (const issue of manifest.issues) {
    if (hits.length >= limit) break;
    if (/^\d+$/.test(q) && issue.number === Number(q)) {
      push(issue, "title", `第 ${issue.number} 期`);
      continue;
    }
    if (includesIgnoreCase(issue.title, q)) {
      push(issue, "title", issue.title);
      continue;
    }
    if (issue.summary && includesIgnoreCase(issue.summary, q)) {
      push(issue, "summary", makeSnippet(issue.summary, q));
    }
  }

  // 2) Deep search in full issue JSON (sections / items)
  if (hits.length < limit) {
    for (const meta of manifest.issues) {
      if (hits.length >= limit) break;
      if (seen.has(meta.number)) continue;

      const issue = getIssue(meta.number);
      if (!issue) continue;

      let found = false;
      let snippet: string | undefined;
      let matchIn: SearchHit["matchIn"] = "content";

      for (const section of issue.sections) {
        if (includesIgnoreCase(section.title, q)) {
          found = true;
          matchIn = "section";
          snippet = section.title;
          break;
        }
        for (const item of section.items) {
          if (item.title && includesIgnoreCase(item.title, q)) {
            found = true;
            matchIn = "content";
            snippet = item.title;
            break;
          }
          const text = stripHtml(item.content || "");
          if (includesIgnoreCase(text, q)) {
            found = true;
            matchIn = "content";
            snippet = makeSnippet(text, q);
            break;
          }
        }
        if (found) break;
      }

      if (found) push(meta, matchIn, snippet);
    }
  }

  return hits;
}
