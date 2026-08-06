import { NextRequest, NextResponse } from "next/server";
import { getIssuesPage, getManifest } from "@/lib/issues";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 5)));

  const manifest = getManifest();
  const issues = getIssuesPage(offset, limit);

  return NextResponse.json({
    issues,
    total: manifest.total,
    offset,
    limit,
  });
}
