import { expect, test } from "@jest/globals";
import { act, render } from "@testing-library/react";
import { MorphingText } from "@/components/ui/liquid-text";

test("intro resolves to the name, holds, and completes once instead of looping", () => {
  window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), addListener: jest.fn() })) as unknown as typeof window.matchMedia;
  let tick: FrameRequestCallback = () => {};
  const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { tick = callback; return 1; });
  const clock = jest.spyOn(performance, "now").mockReturnValue(0);
  const complete = jest.fn();
  const { container, unmount } = render(<MorphingText texts={["", "Matt Domingo"]} onComplete={complete} />);
  act(() => tick(0));
  act(() => tick(1100));
  expect(container.querySelector(".liquid-text > span:last-child")?.textContent).toBe("Matt Domingo");
  expect(complete).not.toHaveBeenCalled();
  act(() => tick(1550));
  expect(complete).not.toHaveBeenCalled();
  act(() => tick(2300));
  expect(complete).toHaveBeenCalledTimes(1);
  unmount();
  raf.mockRestore();
  clock.mockRestore();
});

test("a delayed first paint still plays the complete intro", () => {
  let tick: FrameRequestCallback = () => {};
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { tick = callback; return 1; });
  jest.spyOn(performance, "now").mockReturnValue(0);
  const complete = jest.fn();
  const { container, unmount } = render(<MorphingText texts={["", "Matt Domingo"]} onComplete={complete} />);
  act(() => tick(5000));
  expect(complete).not.toHaveBeenCalled();
  act(() => tick(5550));
  const name = container.querySelector<HTMLElement>(".liquid-text > span:last-child")!;
  expect(Number(name.style.opacity)).toBeGreaterThan(0);
  expect(Number(name.style.opacity)).toBeLessThan(1);
  act(() => tick(7300));
  expect(complete).toHaveBeenCalledTimes(1);
  unmount();
  jest.restoreAllMocks();
});
