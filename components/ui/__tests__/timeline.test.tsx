import { expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import Timeline from "@/components/ui/timeline";
import { JOURNEY } from "@/lib/portfolio-journey";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion") as typeof import("framer-motion");
  return { ...actual, useScroll: () => ({ scrollYProgress: actual.useMotionValue(0) }) };
});

test("all dated résumé entries and supplied milestones remain readable in chronological order", () => {
  window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), addListener: jest.fn() })) as unknown as typeof window.matchMedia;
  global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof IntersectionObserver;
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;
  const { container } = render(<Timeline />);
  const dates = [...container.querySelectorAll("time")].map((time) => time.dateTime);
  expect(dates).toEqual([...dates].sort());
  expect(dates.slice(0, 9)).toEqual(["2014-10", "2018-05", "2018-06", "2021-12", "2022-02", "2022-05", "2023-02", "2023-04", "2024"]);
  const timeline = screen.getByRole("list", { name: "Education and career timeline" });
  expect(within(timeline).getAllByRole("article")).toHaveLength(JOURNEY.length);
  expect(within(timeline).getByText("Visa · Denver")).toBeTruthy();
  expect(within(timeline).getByText("openfloor · NVIDIA Inception")).toBeTruthy();
  expect(within(timeline).getByText(/managing over \$1.1M/)).toBeTruthy();
  expect(within(timeline).getByRole("heading", { name: "Eagle Scout" })).toBeTruthy();
  expect(within(timeline).getByRole("img", { name: /Middle school graduation/ }).getAttribute("src")).toContain("middle-school");
  expect(within(timeline).getByRole("img", { name: /Wisconsin graduation/ }).getAttribute("src")).toContain("wisconsin");
  expect(within(timeline).getByRole("img", { name: /High school graduation/ }).getAttribute("src")).toContain("high-school");
  expect(within(timeline).getAllByRole("img")).toHaveLength(10);
  const filmLink = within(timeline).getByRole("link", { name: "Watch Wasted on YouTube" });
  expect(filmLink.getAttribute("href")).toBe("https://www.youtube.com/watch?v=DEc_Jk3I4J4");
  expect(filmLink.getAttribute("target")).toBe("_blank");
  expect(within(filmLink).getByRole("img").getAttribute("src")).toContain("DEc_Jk3I4J4");
  expect(screen.getByText(/AWS Certified Cloud Practitioner/)).toBeTruthy();
});
