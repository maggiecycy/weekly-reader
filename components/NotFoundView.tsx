"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export function NotFoundView() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">{t.notFound.title}</h1>
      <p className="mt-2 text-muted">{t.notFound.body}</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}
