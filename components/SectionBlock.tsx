import type { Section } from "@/lib/types";

const SECTION_ICONS: Record<string, string> = {
  封面图: "▣",
  科技动态: "◈",
  文章: "◉",
  工具: "⬡",
  资源: "◇",
  图片: "▣",
  文摘: "▤",
  言论: "❝",
  往年回顾: "↺",
  "AI 相关": "✦",
};

function ExternalIcon() {
  return (
    <svg
      className="inline h-3.5 w-3.5 shrink-0 opacity-60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function SectionBlock({ section }: { section: Section }) {
  const icon = SECTION_ICONS[section.title] ?? "●";
  const isEssay =
    section.items.length === 1 &&
    !section.items[0].title &&
    section.title !== "封面图";

  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3 border-l-4 border-accent pl-4">
        <span className="text-accent" aria-hidden>
          {icon}
        </span>
        <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
      </div>

      {section.title === "封面图" ? (
        <div className="overflow-hidden rounded-2xl">
          {section.items[0]?.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={section.items[0].images[0]}
              alt={section.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full rounded-2xl"
            />
          ) : null}
          {section.items[0]?.content ? (
            <div
              className="prose-issue mt-3 text-sm text-muted"
              dangerouslySetInnerHTML={{ __html: section.items[0].content }}
            />
          ) : null}
        </div>
      ) : isEssay ? (
        <div
          className="prose-issue text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: section.items[0].content }}
        />
      ) : (
        <div className="space-y-4">
          {section.items.map((item, idx) => {
            const primary = item.links[0];
            return (
              <article
                key={idx}
                className="rounded-xl border border-border bg-card p-5 transition hover:border-accent/30"
              >
                {item.title ? (
                  <h3 className="text-base font-semibold leading-snug">
                    {primary ? (
                      <a
                        href={primary.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-foreground hover:text-accent"
                      >
                        <span>
                          {idx + 1}. {item.title}
                        </span>
                        <ExternalIcon />
                      </a>
                    ) : (
                      <span>
                        {idx + 1}. {item.title}
                      </span>
                    )}
                  </h3>
                ) : null}

                {item.images?.length ? (
                  <div className="mt-3 space-y-2">
                    {item.images.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="max-h-80 w-auto rounded-lg"
                      />
                    ))}
                  </div>
                ) : null}

                {item.content ? (
                  <div
                    className="prose-issue mt-3 text-sm text-muted [&_img]:hidden"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                ) : null}

                {item.links.length > 1 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.links.slice(1).map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-xs text-muted transition hover:text-accent"
                      >
                        {link.text}
                        <ExternalIcon />
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
