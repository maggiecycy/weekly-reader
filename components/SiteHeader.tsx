"use client";

import Link from "next/link";
import { SITE_NAME, SOURCE_REPO } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/provider";
import { LocaleToggle } from "./LocaleToggle";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <nav className="flex shrink-0 items-center gap-4 text-sm sm:gap-6">
          <Link
            href="/"
            className="font-semibold tracking-tight text-foreground transition hover:text-accent"
          >
            {SITE_NAME}
          </Link>
          <Link
            href="/archive"
            className="text-muted transition hover:text-foreground"
          >
            {t.nav.archive}
          </Link>
          <a
            href={SOURCE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-muted transition hover:text-foreground md:inline"
          >
            {t.nav.sourceRepo}
          </a>
        </nav>
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 sm:max-w-md sm:flex-none">
          <SearchBox />
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
