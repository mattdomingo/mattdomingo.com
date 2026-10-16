import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import PortfolioIntro from "@/components/portfolio-intro";

let mockReduced = false;
jest.mock("framer-motion", () => ({ useReducedMotion: () => mockReduced }));

afterEach(() => { mockReduced = false; jest.restoreAllMocks(); });

test("the intro keeps the name as a heading and reveals folders only after it reaches the top", () => {
  let tick: FrameRequestCallback = () => {};
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { tick = callback; return 1; });
  jest.spyOn(performance, "now").mockReturnValue(0);
  const complete = jest.fn();
  const { container } = render(<PortfolioIntro onComplete={complete} />);
  const header = container.querySelector("header")!;
  act(() => tick(0));
  act(() => tick(2300));
  expect(header.hasAttribute("data-settled")).toBe(true);
  expect(complete).not.toHaveBeenCalled();
  const landed = createEvent.transitionEnd(header);
  Object.defineProperty(landed, "propertyName", { value: "top" });
  fireEvent(header, landed);
  fireEvent(header, landed);
  expect(complete).toHaveBeenCalledTimes(1);
  expect(container.querySelector(".portfolio-intro")).toBeNull();
  expect(screen.getByRole("heading", { name: "Matt Domingo", level: 1 })).toBeTruthy();
  expect(container.querySelector(".liquid-text")).toBeNull();
  expect(container.querySelectorAll("[data-proximity-letter]")).toHaveLength(12);
});

test("reduced motion shows the name at the top and unlocks the page immediately", () => {
  mockReduced = true;
  const complete = jest.fn();
  const { container } = render(<PortfolioIntro onComplete={complete} />);
  expect(complete).toHaveBeenCalledTimes(1);
  expect(container.querySelector(".portfolio-intro")).toBeNull();
  expect(container.querySelector(".portfolio-name[data-settled]")).not.toBeNull();
  expect(screen.getByRole("heading", { name: "Matt Domingo", level: 1 })).toBeTruthy();
});
