import { AUTHOR_NAME, COPYRIGHT_NOTICE, SOURCE_REPO } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted leading-relaxed">
          内容作者：
          <span className="text-foreground">{AUTHOR_NAME}</span>
          。原文发布于{" "}
          <a
            href="https://www.ruanyifeng.com/blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            ruanyifeng.com
          </a>
          ，开源仓库{" "}
          <a
            href={SOURCE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            ruanyf/weekly
          </a>
          。
        </p>
        <p className="mt-2 text-sm text-muted">{COPYRIGHT_NOTICE}</p>
      </div>
    </footer>
  );
}
