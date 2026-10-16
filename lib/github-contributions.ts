export type ContributionDay = { date: string; count: number };
export type GitHubContributions = { days: ContributionDay[]; endDate: string };

// GitHub's public calendar pairs dated cells with exact-count tooltips.
// Fail closed if its markup changes; never substitute sample activity.
export function parseGitHubContributions(html: string): GitHubContributions {
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = /\bfor="([^"]+)"/.exec(match[1])?.[1];
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const count = /^(No|[\d,]+) contributions? on /.exec(text)?.[1];
    if (id && count) counts.set(id, count === "No" ? 0 : Number(count.replaceAll(",", "")));
  }
  const days: ContributionDay[] = [];
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = /\bdata-date="(\d{4}-\d{2}-\d{2})"/.exec(match[1])?.[1];
    if (!date) continue;
    const id = /\bid="([^"]+)"/.exec(match[1])?.[1];
    const count = id ? counts.get(id) : undefined;
    if (count === undefined || !Number.isSafeInteger(count) || count < 0 || new Date(date).toISOString().slice(0, 10) !== date) {
      throw new Error("Invalid GitHub contribution day");
    }
    days.push({ date, count });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 365 || days.length > 371 || days.some((day, index) => index > 0 && Date.parse(day.date) - Date.parse(days[index - 1].date) !== 86400000)) {
    throw new Error("Incomplete GitHub contribution calendar");
  }
  return { days, endDate: days[days.length - 1].date };
}
