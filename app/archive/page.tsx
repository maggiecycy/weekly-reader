import type { Metadata } from "next";
import { ArchiveView } from "@/components/ArchiveView";
import { getManifest, groupIssuesByYear } from "@/lib/issues";

export const metadata: Metadata = {
  title: "Archive / 归档",
  description: "Browse all Weekly issues by year",
};

export default function ArchivePage() {
  const manifest = getManifest();
  const groups = groupIssuesByYear(manifest.issues);
  const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <ArchiveView total={manifest.total} years={years} groups={groups} />
  );
}
