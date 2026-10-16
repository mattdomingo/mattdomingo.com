import { expect, test, beforeEach } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RepositoryLink from "@/components/repository-link";

beforeEach(() => { window.PointerEvent = MouseEvent as unknown as typeof PointerEvent; });

test.each([
  ["https://github.com/mattdomingo/QuestGPT", "View Repository", ".lucide-github"],
  ["https://opnflr.com", "Visit Website", ".lucide-globe"],
])("%s has the matching icon and tracks the cursor without intercepting it", async (href, label, icon) => {
  render(<dialog open><RepositoryLink href={href} /></dialog>);
  const link = screen.getByRole("link", { name: label });
  expect(link.querySelector(icon)).not.toBeNull();
  expect(link.textContent).toBe("");
  expect(link.getAttribute("target")).toBe("_blank");
  fireEvent.pointerEnter(link, { clientX: 100, clientY: 100 });
  const tip = screen.getByRole("tooltip");
  expect(tip.textContent).toBe(label);
  expect(tip.closest("dialog")).not.toBeNull();
  expect(tip.getAttribute("style")).toContain("114px");
  fireEvent.pointerMove(link, { clientX: 150, clientY: 180 });
  await waitFor(() => expect(tip.getAttribute("style")).toContain("164px"));
  expect(tip.getAttribute("style")).toContain("198px");
  fireEvent.pointerLeave(link);
  expect(screen.queryByRole("tooltip")).toBeNull();
});

test("keyboard focus exposes the tooltip at the button", () => {
  render(<RepositoryLink href="https://github.com/mattdomingo" label="View GitHub Profile" />);
  const link = screen.getByRole("link", { name: "View GitHub Profile" });
  jest.spyOn(link, "matches").mockReturnValue(true);
  fireEvent.focus(link);
  expect(screen.getByRole("tooltip").textContent).toBe("View GitHub Profile");
  fireEvent.blur(link);
  expect(screen.queryByRole("tooltip")).toBeNull();
});
