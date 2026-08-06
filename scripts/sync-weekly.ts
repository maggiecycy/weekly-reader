/**
 * Sync 科技爱好者周刊 from GitHub (ruanyf/weekly).
 *
 * Usage:
 *   npx tsx scripts/sync-weekly.ts
 *   npx tsx scripts/sync-weekly.ts --limit 20
 *   npx tsx scripts/sync-weekly.ts --all
 */

import fs from "fs";
import path from "path";
import { parseWeeklyMarkdown } from "../lib/parser";
import type { Manifest, ManifestIssue, WeeklyIssue } from "../lib/types";
import {
  INITIAL_SYNC_LIMIT,
  RSS_URL,
  SOURCE_CDN_BASE,
  SOURCE_RAW_BASE,
  SOURCE_REPO_API,
} from "../lib/constants";

const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const ISSUES_DIR = path.join(CONTENT_DIR, "issues");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");
const RAW_DIR = path.join(CONTENT_DIR, "raw");

interface GitHubContentItem {
  name: string;
  path: string;
  download_url: string | null;
  type: string;
}

interface RssMeta {
  date: string;
  sourceUrl: string;
}

function ensureDirs() {
  fs.mkdirSync(ISSUES_DIR, { recursive: true });
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return { latest: 0, syncedAt: "", total: 0, issues: [] };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")) as Manifest;
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "weekly-reader-sync",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function listIssueFiles(): Promise<
  { number: number; downloadUrl: string; name: string }[]
> {
  const res = await fetch(SOURCE_REPO_API, { headers: githubHeaders() });
  if (!res.ok) {
    throw new Error(
      `GitHub API error ${res.status}: ${await res.text()}. Tip: set GITHUB_TOKEN to avoid rate limits.`,
    );
  }
  const items = (await res.json()) as GitHubContentItem[];
  return items
    .filter((i) => i.type === "file" && /^issue-\d+\.md$/.test(i.name))
    .map((i) => {
      const m = i.name.match(/^issue-(\d+)\.md$/);
      return {
        number: Number(m![1]),
        downloadUrl:
          i.download_url ?? `${SOURCE_RAW_BASE}/${i.name}`,
        name: i.name,
      };
    })
    .sort((a, b) => b.number - a.number);
}

async function fetchRssMeta(): Promise<Map<number, RssMeta>> {
  const map = new Map<number, RssMeta>();
  try {
    const res = await fetch(RSS_URL, {
      headers: { "User-Agent": "weekly-reader-sync" },
    });
    if (!res.ok) return map;
    const xml = await res.text();
    const entries = xml.split(/<entry>/).slice(1);
    for (const entry of entries) {
      const title = entry.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] ?? "";
      if (!title.includes("科技爱好者周刊")) continue;
      const numMatch = title.match(/第\s*(\d+)\s*期/);
      if (!numMatch) continue;
      const number = Number(numMatch[1]);
      const link =
        entry.match(/<link[^>]*href="([^"]+)"/)?.[1] ??
        `https://www.ruanyifeng.com/blog/weekly-issue-${number}.html`;
      const updated =
        entry.match(/<updated>([^<]+)<\/updated>/)?.[1] ??
        entry.match(/<published>([^<]+)<\/published>/)?.[1] ??
        "";
      const date = updated ? updated.slice(0, 10) : "";
      map.set(number, { date, sourceUrl: link });
    }
  } catch (err) {
    console.warn("RSS fetch failed (non-fatal):", err);
  }
  return map;
}

/** Estimate date from issue number when RSS has no entry (rough, Friday cadence). */
function estimateDate(number: number, latestKnown?: { n: number; date: string }): string {
  if (latestKnown?.date) {
    const weeks = latestKnown.n - number;
    const d = new Date(latestKnown.date);
    d.setDate(d.getDate() - weeks * 7);
    return d.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

async function downloadMarkdown(name: string, githubUrl: string): Promise<string> {
  const urls = [
    `${SOURCE_CDN_BASE}/${name}`,
    githubUrl,
    `${SOURCE_RAW_BASE}/${name}`,
  ];
  let lastError: unknown;
  for (const url of urls) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "weekly-reader-sync" },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return await res.text();
      } catch (err) {
        lastError = err;
        await new Promise((r) => setTimeout(r, 300 * attempt));
      }
    }
  }
  throw lastError;
}

function toManifestIssue(issue: WeeklyIssue): ManifestIssue {
  return {
    number: issue.number,
    title: issue.title,
    date: issue.date,
    coverImage: issue.coverImage,
    summary: issue.summary,
    sourceUrl: issue.sourceUrl,
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const limitIdx = args.indexOf("--limit");
  const limit =
    limitIdx >= 0 ? Number(args[limitIdx + 1]) : INITIAL_SYNC_LIMIT;
  const force = args.includes("--force");
  return { all, limit: Number.isFinite(limit) ? limit : INITIAL_SYNC_LIMIT, force };
}

async function main() {
  const { all, limit, force } = parseArgs();
  ensureDirs();

  console.log("Fetching issue list from GitHub…");
  const files = await listIssueFiles();
  console.log(`Found ${files.length} issue files.`);

  const rssMeta = await fetchRssMeta();
  console.log(`RSS mapped ${rssMeta.size} weekly entries.`);

  const existing = new Set(
    force
      ? []
      : fs
          .readdirSync(ISSUES_DIR)
          .filter((f) => /^\d+\.json$/.test(f))
          .map((f) => Number(f.replace(".json", ""))),
  );

  const candidates = all ? files : files.slice(0, limit);
  const toSync = candidates.filter((f) => !existing.has(f.number));

  console.log(
    `Will sync ${toSync.length} issue(s)` +
      (all ? " (all missing)" : ` (limit ${limit}, skip cached)`),
  );

  const latestFile = files[0];
  const latestRss = latestFile ? rssMeta.get(latestFile.number) : undefined;
  const latestKnown = latestRss?.date
    ? { n: latestFile!.number, date: latestRss.date }
    : undefined;

  let synced = 0;
  for (const file of toSync) {
    process.stdout.write(`  #${file.number}… `);
    try {
      const md = await downloadMarkdown(file.name, file.downloadUrl);
      fs.writeFileSync(path.join(RAW_DIR, file.name), md, "utf-8");

      const meta = rssMeta.get(file.number);
      const date =
        meta?.date || estimateDate(file.number, latestKnown);
      const sourceUrl =
        meta?.sourceUrl ||
        `https://www.ruanyifeng.com/blog/weekly-issue-${file.number}.html`;

      const issue = parseWeeklyMarkdown(md, {
        number: file.number,
        date,
        sourceUrl,
      });

      fs.writeFileSync(
        path.join(ISSUES_DIR, `${file.number}.json`),
        JSON.stringify(issue, null, 2),
        "utf-8",
      );
      console.log("ok");
      synced++;
      // Be gentle with rate limits
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      console.log("FAIL");
      console.error(err);
    }
  }

  // Rebuild manifest from all local JSON files
  const allNumbers = fs
    .readdirSync(ISSUES_DIR)
    .filter((f) => /^\d+\.json$/.test(f))
    .map((f) => Number(f.replace(".json", "")))
    .sort((a, b) => b - a);

  const issues: ManifestIssue[] = allNumbers.map((n) => {
    const issue = JSON.parse(
      fs.readFileSync(path.join(ISSUES_DIR, `${n}.json`), "utf-8"),
    ) as WeeklyIssue;
    return toManifestIssue(issue);
  });

  const manifest: Manifest = {
    latest: issues[0]?.number ?? 0,
    syncedAt: new Date().toISOString(),
    total: issues.length,
    issues,
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(
    `\nDone. Synced ${synced} new. Manifest: ${manifest.total} issues, latest #${manifest.latest}.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
