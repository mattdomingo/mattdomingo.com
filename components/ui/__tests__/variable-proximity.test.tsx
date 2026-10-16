import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { VariableProximity } from "@/components/ui/variable-proximity";

let mockReduced = false;
jest.mock("framer-motion", () => ({ useReducedMotion: () => mockReduced }));
afterEach(() => { mockReduced = false; jest.restoreAllMocks(); });

function point(host: Element, action: "pointerMove" | "pointerDown" | "pointerUp" | "pointerOut", pointerType = "mouse", x = 5) {
  const event = createEvent[action](host);
  Object.defineProperties(event, { pointerType: { value: pointerType }, clientX: { value: x }, clientY: { value: 5 } });
  fireEvent(host, event);
}

test("nearby letters gain weight, distant letters stay still, and leaving resets the text", () => {
  let tick: FrameRequestCallback = () => {};
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { tick = callback; return 1; });
  const { container } = render(<h1><VariableProximity text="Matt Domingo" /></h1>);
  const host = container.querySelector(".variable-proximity")!;
  const letters = Array.from(container.querySelectorAll<HTMLElement>("[data-proximity-letter]"));
  letters.forEach((letter, index) => jest.spyOn(letter, "getBoundingClientRect").mockReturnValue({ x: index * 30, y: 0, width: 10, height: 10 } as DOMRect));
  expect(screen.getByRole("heading", { name: "Matt Domingo" })).toBeTruthy();
  const initialFrames = jest.mocked(requestAnimationFrame).mock.calls.length;
  point(host, "pointerMove");
  point(host, "pointerMove");
  expect(requestAnimationFrame).toHaveBeenCalledTimes(initialFrames + 1);
  act(() => tick(16));
  expect(letters[0].style.fontVariationSettings).toBe('"wght" 800');
  const neighborWeight = Number(letters[1].style.fontVariationSettings.match(/[\d.]+/)?.[0]);
  expect(neighborWeight).toBeGreaterThan(400);
  expect(neighborWeight).toBeLessThan(800);
  expect(letters.at(-1)?.style.fontVariationSettings).toBe('"wght" 400');
  fireEvent.pointerLeave(host);
  expect(letters.every((letter) => letter.style.fontVariationSettings === '"wght" 400')).toBe(true);
});

test("paused and reduced-motion visitors get steady text", () => {
  const request = jest.spyOn(window, "requestAnimationFrame");
  const { container, rerender } = render(<VariableProximity text="Matt Domingo" paused />);
  point(container.querySelector(".variable-proximity")!, "pointerDown", "touch");
  expect(request).not.toHaveBeenCalled();
  mockReduced = true;
  rerender(<VariableProximity text="Matt Domingo" />);
  point(container.querySelector(".variable-proximity")!, "pointerMove");
  expect(request).not.toHaveBeenCalled();
  expect(container.querySelector(".variable-proximity")?.getAttribute("data-running")).toBe("false");
});

test("the title sweeps through its letters once on load, even after a delayed first frame", () => {
  let tick: FrameRequestCallback = () => {};
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { tick = callback; return 1; });
  const { container, unmount } = render(<VariableProximity text="Matt Domingo" />);
  const host = container.querySelector(".variable-proximity")!;
  const letters = Array.from(container.querySelectorAll<HTMLElement>("[data-proximity-letter]"));
  jest.spyOn(host, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 340, height: 10 } as DOMRect);
  letters.forEach((letter, index) => jest.spyOn(letter, "getBoundingClientRect").mockReturnValue({ x: index * 30, y: 0, width: 10, height: 10 } as DOMRect));
  act(() => tick(5000));
  act(() => tick(5500));
  expect(letters.some((letter) => letter.style.fontVariationSettings !== '"wght" 400')).toBe(true);
  act(() => tick(6000));
  expect(letters.every((letter) => letter.style.fontVariationSettings === '"wght" 400')).toBe(true);
  const completedFrames = jest.mocked(requestAnimationFrame).mock.calls.length;
  expect(completedFrames).toBe(3);
  unmount();
});

test("a touch starts the effect immediately, dragging updates it, and release resets it after a short hold", () => {
  jest.useFakeTimers();
  let tick: FrameRequestCallback = () => {};
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { tick = callback; return 1; });
  const { container, unmount } = render(<VariableProximity text="Matt Domingo" />);
  const host = container.querySelector(".variable-proximity")!;
  const letter = container.querySelector<HTMLElement>("[data-proximity-letter]")!;
  jest.spyOn(letter, "getBoundingClientRect").mockReturnValue({ x: 0, y: 0, width: 10, height: 10 } as DOMRect);
  try {
    point(host, "pointerDown", "touch");
    expect(letter.style.fontVariationSettings).toBe('"wght" 800');
    point(host, "pointerMove", "touch", 65);
    act(() => tick(16));
    expect(letter.style.fontVariationSettings).toBe('"wght" 600');
    point(host, "pointerUp", "touch");
    point(host, "pointerOut", "touch");
    expect(letter.style.fontVariationSettings).toBe('"wght" 600');
    act(() => jest.advanceTimersByTime(250));
    expect(letter.style.fontVariationSettings).toBe('"wght" 400');
    point(host, "pointerDown", "touch");
    fireEvent.pointerCancel(host);
    expect(letter.style.fontVariationSettings).toBe('"wght" 400');
  } finally {
    unmount();
    jest.useRealTimers();
  }
});
