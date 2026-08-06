import { NextRequest, NextResponse } from "next/server";
import { searchIssues } from "@/lib/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(
    50,
    Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 20)),
  );

  if (!q.trim()) {
    return NextResponse.json({ q, hits: [], total: 0 });
  }

  const hits = searchIssues(q, limit);
  return NextResponse.json({ q, hits, total: hits.length });
}
