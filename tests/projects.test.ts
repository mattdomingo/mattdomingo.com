import { expect, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import fs from "node:fs";
import path from "node:path";
import { getProject, projects } from "@/lib/projects";

const originalProjects: Record<string, string> = {
  "1": "mattdomingo.com",
  "2": "ShipIt",
  "3": "Gravity Pong",
  "4": "NewsTrader",
  "5": "Task Manager",
  "6": "PomoTask",
  "7": "Sheets Project",
  "8": "Label Automation",
  "9": "TruWeaveTrader",
  "10": "QuestGPT",
  "12": "mingo-mail",
  "13": "capture-enrichment",
  "14": "connex",
  "15": "mujoco-sandbox",
  "16": "f1-predictor",
};

test.each(Object.entries(originalProjects))(
  "preserves the existing /projects/%s destination",
  (id, title) => {
    expect(getProject(id)?.title).toBe(title);
  },
);

test.each(["15junk", "015", "-1", "999", "NaN", ""])(
  "rejects malformed or unknown project ID %s",
  (id) => {
    expect(getProject(id)).toBeUndefined();
  },
);

test("all project assets exist and all destinations are unique", () => {
  expect(new Set(projects.map((project) => project.id)).size).toBe(
    projects.length,
  );
  projects.forEach((project) => {
    for (const asset of [
      project.image,
      project.video,
      project.video?.replace(".webm", ".mp4"),
    ].filter(Boolean)) {
      expect(fs.existsSync(path.join(process.cwd(), "public", asset!))).toBe(
        true,
      );
    }
    for (const href of [project.githubUrl, project.liveUrl].filter(Boolean))
      expect(new URL(href!).protocol).toBe("https:");
  });
  expect(getProject("17")?.title).toBe("Openfloor");
  expect(
    fs.existsSync(path.join(process.cwd(), "public/documents/resume.pdf")),
  ).toBe(true);
  expect(
    fs.existsSync(
      path.join(process.cwd(), "public/documents/resume-applied-ai.pdf"),
    ),
  ).toBe(true);
});
