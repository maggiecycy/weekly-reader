import type { WeeklyIssue } from "@/lib/types";
import { SectionBlock } from "./SectionBlock";
import { DesktopToc, MobileToc } from "./TableOfContents";

export function IssueContent({ issue }: { issue: WeeklyIssue }) {
  const tocSections = issue.sections.filter((s) => s.title !== "封面图");

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
      <div className="min-w-0 space-y-12">
        <MobileToc sections={tocSections} />
        {issue.sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </div>
      <div className="relative hidden lg:block">
        <DesktopToc sections={tocSections} />
      </div>
    </div>
  );
}
