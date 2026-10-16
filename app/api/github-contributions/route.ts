import { NextResponse } from "next/server";
import { parseGitHubContributions } from "@/lib/github-contributions";

export async function GET() {
  try {
    const response = await fetch("https://github.com/users/mattdomingo/contributions", {
      headers: { Accept: "text/html", "Accept-Language": "en-US", "User-Agent": "mattdomingo-portfolio" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("GitHub unavailable");
    const calendar = parseGitHubContributions(await response.text());
    if (Math.abs(Date.now() - Date.parse(calendar.endDate)) > 2 * 86400000) throw new Error("Outdated GitHub calendar");
    return NextResponse.json(calendar, { headers: { "Cache-Control": "public, s-maxage=3600" } });
  } catch {
    return NextResponse.json({ error: "GitHub activity is temporarily unavailable." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
