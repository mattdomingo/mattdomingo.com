import { expect, test, beforeEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ExperienceProvider } from "@/components/experience-provider";
import { SiteHeader } from "@/components/site-header";

jest.mock("next/navigation", () => ({ usePathname: () => "/" }));

let systemReduced = false;
let listeners: Set<() => void>;
beforeEach(() => {
  localStorage.clear();
  document.documentElement.dataset.theme = "dark";
  systemReduced = false;
  listeners = new Set();
  window.matchMedia = jest.fn().mockImplementation(() => ({
    get matches() {
      return systemReduced;
    },
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  }));
});
function mount() {
  return render(
    <ExperienceProvider>
      <SiteHeader />
    </ExperienceProvider>,
  );
}

test("theme persists across navigation/remounts", () => {
  const view = mount();
  fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem("portfolio-theme")).toBe("light");
  view.unmount();
  mount();
  expect(
    screen.getByRole("button", { name: "Switch to dark mode" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
  expect(document.documentElement.dataset.theme).toBe("dark");
});

test("manual pause persists and system reduced motion cannot be overridden", () => {
  const view = mount();
  fireEvent.click(screen.getByRole("button", { name: "Pause motion" }));
  expect(localStorage.getItem("portfolio-motion")).toBe("paused");
  expect(document.documentElement.dataset.motion).toBe("reduced");
  view.unmount();
  mount();
  expect(screen.getByRole("button", { name: /Enable motion/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  fireEvent.click(screen.getByRole("button", { name: /Enable motion/ }));
  expect(document.documentElement.dataset.motion).toBe("full");
  act(() => {
    systemReduced = true;
    listeners.forEach((listener) => listener());
  });
  expect(document.documentElement.dataset.motion).toBe("reduced");
  fireEvent.click(screen.getByRole("button", { name: /Enable motion/ }));
  fireEvent.click(screen.getByRole("button", { name: /Enable motion/ }));
  expect(document.documentElement.dataset.motion).toBe("reduced");
});

test("mobile navigation opens, closes on Escape, and restores focus", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
  expect(
    screen.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(
    screen.queryByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open navigation" })).toHaveFocus();
});

test("unavailable storage does not prevent theme changes", () => {
  const failure = jest
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("Storage blocked");
    });
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
  expect(document.documentElement.dataset.theme).toBe("light");
  failure.mockRestore();
});
