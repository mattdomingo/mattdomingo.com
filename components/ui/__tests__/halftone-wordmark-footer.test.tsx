import { act, fireEvent, render, screen } from "@testing-library/react";
import HalftoneWordmarkFooter, { hwfStep } from "@/components/ui/halftone-wordmark-footer";

test("footer follows system appearance, opens external links in new tabs, and respects reduced motion", () => {
  let dark = false;
  let updateTheme = () => {};
  window.matchMedia = jest.fn((query: string) => ({
    get matches() { return query.includes("color-scheme") ? dark : true; },
    addEventListener: (_event: string, callback: () => void) => { if (query.includes("color-scheme")) updateTheme = callback; },
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  const { container } = render(<HalftoneWordmarkFooter wordmark="domingo" label="Matt Domingo" columns={[{ title: "Work", links: [
    { label: "GitHub", href: "https://github.com/mattdomingo" },
    { label: "Journey", href: "#journey" },
  ] }]} />);
  expect(screen.getByText("domingo")).toBeTruthy();
  expect(screen.getByRole("link", { name: "GitHub" }).getAttribute("target")).toBe("_blank");
  expect(screen.getByRole("link", { name: "Journey" }).getAttribute("target")).toBeNull();
  const footer = container.querySelector("footer")!;
  expect(footer.style.getPropertyValue("--hwf-bg")).toBe("#efebe3");
  act(() => { dark = true; updateTheme(); });
  expect(footer.style.getPropertyValue("--hwf-bg")).toBe("#0c0c0b");
  fireEvent.click(screen.getByRole("button", { name: "Back to top ↑" }));
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  jest.restoreAllMocks();
});

test("a displaced halftone dot settles back into the wordmark", () => {
  let [x, y, vx, vy] = [60, 40, 5, -2];
  for (let frame = 0; frame < 240; frame++) {
    [x, y, vx, vy] = hwfStep(x, y, vx, vy, 20, 20, -100000, -100000, 80);
  }
  expect(x).toBeCloseTo(20, 3);
  expect(y).toBeCloseTo(20, 3);
  expect(Math.hypot(vx, vy)).toBeLessThan(.001);
});
