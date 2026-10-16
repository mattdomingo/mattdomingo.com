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
  expect(dates.slice(0, 4)).toEqual(["2014-10", "2018-05", "2018-06", "2022-05"]);
  const timeline = screen.getByRole("list", { name: "Education and career timeline" });
  expect(within(timeline).getAllByRole("article")).toHaveLength(JOURNEY.length);
  expect(within(timeline).getByText("Visa · Denver")).toBeTruthy();
  expect(within(timeline).getByText("openfloor")).toBeTruthy();
  expect(screen.getByText(/AWS Certified Cloud Practitioner/)).toBeTruthy();
});
