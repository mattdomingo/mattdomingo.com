import { expect, test } from "@jest/globals";
import { parseGitHubContributions } from "@/lib/github-contributions";

function calendar(count = "No") {
  return Array.from({ length: 365 }, (_, index) => {
    const date = new Date(Date.UTC(2025, 9, 17) + index * 86400000).toISOString().slice(0, 10);
    return `<td id="day-${index}" data-date="${date}"></td><tool-tip for="day-${index}">${count} contributions on October 17th.</tool-tip>`;
  }).join("");
}

test("pairs GitHub tooltip counts with dates and preserves genuine zero days", () => {
  const html = calendar().replace('No contributions on October 17th.</tool-tip>', '1,234 contributions on October 17th.</tool-tip>');
  const parsed = parseGitHubContributions(html);
  expect(parsed.days).toHaveLength(365);
  expect(parsed.days[0]).toEqual({ date: "2025-10-17", count: 1234 });
  expect(parsed.days[364]).toEqual({ date: "2026-10-16", count: 0 });
  expect(parsed.endDate).toBe("2026-10-16");
  expect(parseGitHubContributions(calendar()).days.every((day) => day.count === 0)).toBe(true);
});

test("rejects missing, malformed, duplicate and incomplete calendars instead of inventing activity", () => {
  expect(() => parseGitHubContributions("<html>Rate limited</html>")).toThrow();
  expect(() => parseGitHubContributions(calendar().replace('for="day-40"', 'for="missing"'))).toThrow();
  expect(() => parseGitHubContributions(calendar().replace('2025-10-18', '2025-10-17'))).toThrow();
  expect(() => parseGitHubContributions(calendar("Unknown"))).toThrow();
});
