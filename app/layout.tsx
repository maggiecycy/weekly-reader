import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { I18nProvider } from "@/lib/i18n/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Personal reader for Ruan Yifeng’s Weekly. Modern layout, bilingual UI. Copyright belongs to the original author.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');var l=localStorage.getItem('locale');if(l==='en')document.documentElement.lang='en';else if(l==='zh')document.documentElement.lang='zh-CN'}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <I18nProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
