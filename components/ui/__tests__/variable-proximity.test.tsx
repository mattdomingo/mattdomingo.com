import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { VariableProximity } from "@/components/ui/variable-proximity";

let mockReduced = false;
jest.mock("framer-motion", () => ({ useReducedMotion: () => mockReduced }));
afterEach(() => { mockReduced = false; jest.restoreAllMocks(); });

function move(host: Element, pointerType = "mouse") {
  const event = createEvent.pointerMove(host);
  Object.defineProperties(event, { pointerType: { value: pointerType }, clientX: { value: 5 }, clientY: { value: 5 } });
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
  move(host);
  move(host);
  expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
  act(() => tick(16));
  expect(letters[0].style.fontVariationSettings).toBe('"wght" 800');
  const neighborWeight = Number(letters[1].style.fontVariationSettings.match(/[\d.]+/)?.[0]);
  expect(neighborWeight).toBeGreaterThan(400);
  expect(neighborWeight).toBeLessThan(800);
  expect(letters.at(-1)?.style.fontVariationSettings).toBe('"wght" 400');
  fireEvent.pointerLeave(host);
  expect(letters.every((letter) => letter.style.fontVariationSettings === '"wght" 400')).toBe(true);
});

test("touch, paused, and reduced-motion visitors get steady text", () => {
  const request = jest.spyOn(window, "requestAnimationFrame");
  const { container, rerender } = render(<VariableProximity text="Matt Domingo" />);
  move(container.querySelector(".variable-proximity")!, "touch");
  expect(request).not.toHaveBeenCalled();
  rerender(<VariableProximity text="Matt Domingo" paused />);
  move(container.querySelector(".variable-proximity")!);
  expect(request).not.toHaveBeenCalled();
  mockReduced = true;
  rerender(<VariableProximity text="Matt Domingo" />);
  move(container.querySelector(".variable-proximity")!);
  expect(request).not.toHaveBeenCalled();
  expect(container.querySelector(".variable-proximity")?.getAttribute("data-running")).toBe("false");
});
