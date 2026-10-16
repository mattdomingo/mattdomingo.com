import { act, createEvent, fireEvent, render } from "@testing-library/react";
import { MorphingText } from "@/components/ui/liquid-text";

let mockReduced = false;
jest.mock("framer-motion", () => ({ useReducedMotion: () => mockReduced }));
afterEach(() => { mockReduced = false; jest.restoreAllMocks(); });

function finishReveal(element: Element, animationName = "liquid-reveal") {
  const event = createEvent.animationEnd(element);
  Object.defineProperty(event, "animationName", { value: animationName });
  fireEvent(element, event);
}

test("the name is already rendered and completion waits for the browser's reveal and hold", () => {
  const complete = jest.fn();
  const { container } = render(<MorphingText texts={["", "Matt Domingo"]} onComplete={complete} />);
  expect(container.querySelector(".liquid-text-in")?.textContent).toBe("Matt Domingo");
  expect(container.querySelector(".liquid-text")?.hasAttribute("data-ready")).toBe(true);
  expect(container.querySelector("svg")).toBeNull();
  expect(complete).not.toHaveBeenCalled();
  finishReveal(container.querySelector(".liquid-text-out")!, "liquid-dissolve");
  expect(complete).not.toHaveBeenCalled();
  finishReveal(container.querySelector(".liquid-text-in")!);
  finishReveal(container.querySelector(".liquid-text-in")!);
  expect(complete).toHaveBeenCalledTimes(1);
});

test("late fonts cannot consume the reveal, and hidden pages pause until visible", async () => {
  const originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");
  let fontsLoaded: () => void = () => {};
  Object.defineProperty(document, "fonts", { configurable: true, value: { ready: new Promise<void>((resolve) => { fontsLoaded = resolve; }) } });
  const hidden = jest.spyOn(document, "hidden", "get").mockReturnValue(false);
  const complete = jest.fn();
  const { container, unmount } = render(<MorphingText texts={["", "Matt Domingo"]} onComplete={complete} />);
  const text = container.querySelector(".liquid-text")!;
  try {
    expect(text.hasAttribute("data-ready")).toBe(false);
    hidden.mockReturnValue(true);
    await act(async () => fontsLoaded());
    expect(text.hasAttribute("data-ready")).toBe(false);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event("visibilitychange"));
    expect(text.hasAttribute("data-ready")).toBe(true);
    expect(complete).not.toHaveBeenCalled();
    hidden.mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(text.hasAttribute("data-ready")).toBe(false);
  } finally {
    unmount();
    if (originalFonts) Object.defineProperty(document, "fonts", originalFonts);
    else Reflect.deleteProperty(document, "fonts");
  }
});

test("multiple words advance only after each full reveal", () => {
  const complete = jest.fn();
  const { container } = render(<MorphingText texts={["", "Matt", "Matt Domingo"]} onComplete={complete} />);
  finishReveal(container.querySelector(".liquid-text-in")!);
  expect(container.querySelector(".liquid-text-in")?.textContent).toBe("Matt Domingo");
  expect(complete).not.toHaveBeenCalled();
  finishReveal(container.querySelector(".liquid-text-in")!);
  expect(complete).toHaveBeenCalledTimes(1);
});

test("reduced motion shows the final name immediately", () => {
  mockReduced = true;
  const complete = jest.fn();
  const { container } = render(<MorphingText texts={["", "Matt Domingo"]} onComplete={complete} />);
  expect(container.querySelector(".liquid-text-static")?.textContent).toBe("Matt Domingo");
  expect(complete).toHaveBeenCalledTimes(1);
});
