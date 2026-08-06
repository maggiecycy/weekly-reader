import type { Metadata } from "next";
import { SearchView } from "@/components/SearchView";
import { searchIssues } from "@/lib/search";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const hits = query ? searchIssues(query, 50) : [];

  return <SearchView query={query} hits={hits} />;
}
