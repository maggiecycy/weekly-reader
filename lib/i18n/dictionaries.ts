export type Locale = "zh" | "en";

export const LOCALES: Locale[] = ["zh", "en"];
export const DEFAULT_LOCALE: Locale = "zh";
export const LOCALE_STORAGE_KEY = "locale";

const zh = {
  nav: {
    archive: "归档",
    sourceRepo: "原仓库",
    searchAria: "搜索周刊",
    searchPlaceholder: "搜索期号 / 标题 / 关键词…",
    searchEmpty: "无匹配结果",
    searchPending: "搜索中…",
    searchViewAll: "查看全部结果 →",
    matchTitle: "标题",
    matchSummary: "摘要",
    matchContent: "正文",
    matchSection: "栏目",
  },
  theme: {
    toggle: "切换主题",
    toLight: "切换到浅色模式",
    toDark: "切换到深色模式",
    light: "浅色",
    dark: "深色",
    lightShort: "光",
    darkShort: "夜",
  },
  locale: {
    switchToZh: "中",
    switchToEn: "EN",
    label: "语言",
  },
  home: {
    badge: "个人阅读器",
    tagline: "科技爱好者周刊 · 现代阅读体验。",
    readLatest: "阅读最新一期",
    githubRepo: "GitHub 原仓库",
    synced: "已同步 {total} 期 · 最新 #{latest}",
    syncedAt: " · 同步于 {date}",
    empty: "暂无数据。请先运行 npm run sync",
    latestTitle: "最新周刊",
    latestHint: "默认展示最近 {n} 期，点击加载更多",
    viewArchive: "查看归档 →",
  },
  loadMore: {
    button: "加载更多往期",
    loading: "加载中…",
    done: "已加载全部 {n} 期",
    error: "加载失败，请稍后重试",
  },
  archive: {
    title: "归档",
    subtitle: "共 {total} 期，按年份分组",
  },
  issue: {
    author: "作者 {name}",
    readOriginal: "阅读原文（ruanyifeng.com）",
    githubMd: "GitHub Markdown",
    prev: "上一期",
    next: "下一期",
    toc: "目录",
    tocExpand: "展开",
    tocCollapse: "收起",
    contentNote: "周刊正文为中文原文，界面可切换语言。",
  },
  search: {
    title: "搜索",
    results: "「{q}」共 {n} 条结果",
    hint: "输入关键词检索已同步的周刊内容",
    match: "匹配 {type}",
  },
  notFound: {
    title: "未找到该期周刊",
    body: "请检查期号，或返回首页浏览已同步内容。",
    back: "返回首页",
  },
  footer: {
    byline:
      "内容作者：{author}。原文发布于 ruanyifeng.com，开源仓库 ruanyf/weekly。",
    copyright: "内容版权归阮一峰所有，本站仅供个人阅读，非官方镜像。",
  },
  card: {
    noCover: "无封面",
  },
};

export type Dictionary = {
  [K in keyof typeof zh]: {
    [P in keyof (typeof zh)[K]]: string;
  };
};

const en: Dictionary = {
  nav: {
    archive: "Archive",
    sourceRepo: "Source",
    searchAria: "Search issues",
    searchPlaceholder: "Issue # / title / keyword…",
    searchEmpty: "No results",
    searchPending: "Searching…",
    searchViewAll: "View all results →",
    matchTitle: "Title",
    matchSummary: "Summary",
    matchContent: "Body",
    matchSection: "Section",
  },
  theme: {
    toggle: "Toggle theme",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    light: "Light",
    dark: "Dark",
    lightShort: "Lt",
    darkShort: "Dk",
  },
  locale: {
    switchToZh: "中",
    switchToEn: "EN",
    label: "Language",
  },
  home: {
    badge: "Personal reader",
    tagline:
      "A modern reader for Ruan Yifeng’s Weekly. Article body stays in Chinese.",
    readLatest: "Read latest issue",
    githubRepo: "GitHub repo",
    synced: "{total} issues synced · latest #{latest}",
    syncedAt: " · synced {date}",
    empty: "No data yet. Run npm run sync first.",
    latestTitle: "Latest issues",
    latestHint: "Showing the latest {n}. Load more below.",
    viewArchive: "Archive →",
  },
  loadMore: {
    button: "Load more",
    loading: "Loading…",
    done: "All {n} issues loaded",
    error: "Failed to load. Try again.",
  },
  archive: {
    title: "Archive",
    subtitle: "{total} issues, grouped by year",
  },
  issue: {
    author: "By {name}",
    readOriginal: "Read original (ruanyifeng.com)",
    githubMd: "GitHub Markdown",
    prev: "Older",
    next: "Newer",
    toc: "Contents",
    tocExpand: "Expand",
    tocCollapse: "Collapse",
    contentNote: "Issue body is in Chinese; only the UI is bilingual.",
  },
  search: {
    title: "Search",
    results: "{n} results for “{q}”",
    hint: "Search synced issues by number, title, or keyword",
    match: "Matched in {type}",
  },
  notFound: {
    title: "Issue not found",
    body: "Check the issue number, or go home to browse synced issues.",
    back: "Back to home",
  },
  footer: {
    byline:
      "Author: {author}. Originally on ruanyifeng.com · repo ruanyf/weekly.",
    copyright:
      "Copyright belongs to Ruan Yifeng. Personal reader only — not an official mirror.",
  },
  card: {
    noCover: "No cover",
  },
};

export const dictionaries: Record<Locale, Dictionary> = {
  zh: zh as Dictionary,
  en,
};

/** Simple `{name}` interpolation */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}
