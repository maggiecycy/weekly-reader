import type { IssueItem, IssueLink, Section, WeeklyIssue } from "./types";
import { SOURCE_BLOB_BASE } from "./constants";

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function extractLinks(text: string): IssueLink[] {
  const links: IssueLink[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    links.push({ text: match[1], url: match[2] });
  }
  return links;
}

function extractImages(text: string): string[] {
  const images: string[] = [];
  const re = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    images.push(match[2]);
  }
  return images;
}

/** Convert a subset of Markdown to safe-ish HTML for rendering. */
export function mdToHtml(md: string): string {
  let html = md.trim();
  if (!html) return "";

  // Images first (before links)
  html = html.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" referrerpolicy="no-referrer" />',
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Bold / italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Blockquotes (line-based)
  const lines = html.split("\n");
  const out: string[] = [];
  let inQuote = false;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${para.join("<br />")}</p>`);
      para = [];
    }
  };

  for (const line of lines) {
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushPara();
      if (!inQuote) {
        out.push("<blockquote>");
        inQuote = true;
      }
      out.push(`<p>${quote[1]}</p>`);
      continue;
    }
    if (inQuote) {
      out.push("</blockquote>");
      inQuote = false;
    }
    if (!line.trim()) {
      flushPara();
      continue;
    }
    para.push(line);
  }
  if (inQuote) out.push("</blockquote>");
  flushPara();

  return out.join("\n");
}

function parseNumberedItems(body: string): IssueItem[] {
  const items: IssueItem[] = [];
  // Split on lines that start with "N、" or "N."
  const parts = body.split(/\n(?=\d+[、.]\s*)/);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const headerMatch = trimmed.match(/^(\d+)[、.]\s*(?:\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(.+?))(?:\s*（[^）]*）)?\s*\n?([\s\S]*)$/);
    if (!headerMatch) {
      const images = extractImages(trimmed);
      const links = extractLinks(trimmed);
      items.push({
        content: mdToHtml(trimmed),
        links,
        images: images.length ? images : undefined,
      });
      continue;
    }

    const linkTitle = headerMatch[2];
    const linkUrl = headerMatch[3];
    const plainTitle = headerMatch[4]?.trim();
    const rest = headerMatch[5] ?? "";

    const title = linkTitle || plainTitle;
    const images = extractImages(trimmed);
    const links = extractLinks(trimmed);

    // Prefer the header link as primary
    if (linkUrl && linkTitle) {
      const exists = links.some((l) => l.url === linkUrl);
      if (!exists) links.unshift({ text: linkTitle, url: linkUrl });
    }

    items.push({
      title,
      content: mdToHtml(rest || trimmed.replace(/^\d+[、.]\s*/, "")),
      links,
      images: images.length ? images : undefined,
    });
  }
  return items;
}

function isListHeavySection(body: string): boolean {
  const numbered = (body.match(/^\d+[、.]/gm) || []).length;
  return numbered >= 2;
}

function parseSectionBody(title: string, body: string): IssueItem[] {
  const trimmed = body.trim();
  if (!trimmed) return [];

  if (title === "封面图") {
    const images = extractImages(trimmed);
    const links = extractLinks(trimmed);
    const caption = trimmed
      .replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, "")
      .trim();
    return [
      {
        content: mdToHtml(caption),
        links,
        images: images.length ? images : undefined,
      },
    ];
  }

  if (isListHeavySection(trimmed) || /^\d+[、.]/.test(trimmed)) {
    return parseNumberedItems(trimmed);
  }

  // Essay / free-form section → single item
  return [
    {
      content: mdToHtml(trimmed),
      links: extractLinks(trimmed),
      images: extractImages(trimmed).length
        ? extractImages(trimmed)
        : undefined,
    },
  ];
}

function extractSummary(markdown: string, sections: Section[]): string {
  // Prefer first paragraph after H1, before first ##
  const afterTitle = markdown.replace(/^#[^\n]+\n+/, "");
  const intro = afterTitle.split(/\n##\s/)[0] ?? "";
  const plain = intro
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain && !plain.startsWith("这里记录每周")) {
    return plain.slice(0, 120) + (plain.length > 120 ? "…" : "");
  }

  // Fallback: first non-cover section text
  for (const section of sections) {
    if (section.title === "封面图") continue;
    const text = section.items[0]?.content
      ?.replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text) return text.slice(0, 120) + (text.length > 120 ? "…" : "");
  }
  return "";
}

export interface ParseOptions {
  number: number;
  date?: string;
  sourceUrl?: string;
}

export function parseWeeklyMarkdown(
  markdown: string,
  options: ParseOptions,
): WeeklyIssue {
  const titleMatch = markdown.match(
    /^#\s*科技爱好者周刊（第\s*(\d+)\s*期）[：:]\s*(.+)$/m,
  );
  const number = titleMatch
    ? Number(titleMatch[1])
    : options.number;
  const title = titleMatch?.[2]?.trim() ?? `第 ${number} 期`;

  // Split into ## sections
  const sectionChunks = markdown.split(/\n(?=##\s+)/);
  const sections: Section[] = [];
  let coverImage: string | undefined;
  let coverCaption: string | undefined;

  for (const chunk of sectionChunks) {
    const m = chunk.match(/^##\s+(.+)\n([\s\S]*)$/);
    if (!m) continue;
    const sectionTitle = m[1].trim();
    const body = m[2].replace(/\n（完）\s*$/, "").trim();
    if (sectionTitle === "目录") continue;

    const id = slugify(sectionTitle) || `section-${sections.length}`;
    const items = parseSectionBody(sectionTitle, body);
    sections.push({ id, title: sectionTitle, items });

    if (sectionTitle === "封面图" && items[0]?.images?.[0]) {
      coverImage = items[0].images[0];
      coverCaption = items[0].content.replace(/<[^>]+>/g, "").trim();
    }
  }

  // If no explicit 封面图, use first image in doc
  if (!coverImage) {
    const all = extractImages(markdown);
    coverImage = all[0];
  }

  const summary = extractSummary(markdown, sections);
  const sourceUrl =
    options.sourceUrl ??
    `https://www.ruanyifeng.com/blog/weekly-issue-${number}.html`;

  return {
    number,
    title,
    date: options.date ?? new Date().toISOString().slice(0, 10),
    coverImage,
    coverCaption,
    summary,
    sections,
    sourceUrl,
    githubUrl: `${SOURCE_BLOB_BASE}/issue-${number}.md`,
  };
}
