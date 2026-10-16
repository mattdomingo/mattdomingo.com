import { expect, test, beforeEach } from "@jest/globals";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import PortfolioFolders from "@/components/portfolio-folders";
import { CODING_JOKES } from "@/lib/coding-jokes";



let dark = false;
let changeTheme: (() => void) | undefined;
beforeEach(() => {
  dark = false;
  global.fetch = jest.fn(() => new Promise(() => {})) as unknown as typeof fetch;
  window.matchMedia = jest.fn(() => ({ matches: dark, media: "", onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: (_type: string, callback: () => void) => { changeTheme = callback; }, removeEventListener: jest.fn(), dispatchEvent: jest.fn() })) as unknown as typeof window.matchMedia;
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});

test.each([
  ["QuestGPT", "QuestGPT GitHub", "View Repository", "https://github.com/mattdomingo/QuestGPT"],
  ["Recall", "Recall GitHub", "View Repository", "https://github.com/mattdomingo/speedhacks"],
  ["Multiplayer AI", "Multiplayer AI Open source soon", "View Repository", "https://github.com/mattdomingo/openfloor"],
  ["Physical AI", "Physical AI opnflr.com", "Visit Website", "https://opnflr.com"],
])("%s opens an in-page summary and image with a new-tab destination", (name, tile, link, url) => {
  render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Projects, 5 items" }));
  fireEvent.click(screen.getByRole("button", { name: tile, exact: true }));
  const dialog = screen.getByRole("dialog", { name });
  expect(within(dialog).getByRole("heading", { level: 3 })).toBeTruthy();
  expect(within(dialog).getByRole("img")).toBeTruthy();
  const destination = within(dialog).getByRole("link", { name: new RegExp(link) });
  expect(destination.getAttribute("href")).toBe(url);
  expect(destination.getAttribute("target")).toBe("_blank");
  expect(destination.closest(".project-tags")).not.toBeNull();
});

test("photo previews keep the fitted image and close control without a zoom button", () => {
  render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Matt Domingo, 5 items" }));
  fireEvent.click(screen.getByRole("button", { name: "Go Badgers", exact: true }));
  const dialog = screen.getByRole("dialog", { name: "Go Badgers" });
  expect(within(dialog).getByRole("img")).toBeTruthy();
  expect(within(dialog).getByRole("button", { name: "Close photo" })).toBeTruthy();
  expect(within(dialog).queryByRole("button", { name: /zoom/i })).toBeNull();
  expect(within(dialog).getByRole("region", { name: "Photo preview" }).hasAttribute("data-zoomed")).toBe(false);
});

test("GitHub opens the skyline, and connect links open in a new tab with the revised email label", () => {
  render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Projects, 5 items" }));
  fireEvent.click(screen.getByRole("button", { name: "GitHub Projects" }));
  expect(within(screen.getByRole("dialog", { name: "GitHub" })).getByText("Loading contributions from GitHub…")).toBeTruthy();
  const github = screen.getByRole("dialog", { name: "GitHub" });
  expect(CODING_JOKES).toContain(within(github).getByRole("heading", { level: 3 }).textContent);
  expect(within(github).getByRole("link", { name: "View GitHub Profile" }).closest(".github-heading")).not.toBeNull();
  expect(within(github).queryByText(/A year of building|From your public GitHub profile/)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Open Connect, 4 items" }));
  expect(screen.getByRole("link", { name: "Email" }).getAttribute("href")).toBe("mailto:matthew.domingo2022@gmail.com");
  for (const anchor of screen.getAllByRole("link")) expect(anchor.getAttribute("target")).toBe("_blank");
});

test("clicking the GitHub card and headline each chooses a new joke, even with the same random value", () => {
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  try {
    render(<PortfolioFolders />);
    fireEvent.click(screen.getByRole("button", { name: "Open Projects, 5 items" }));
    fireEvent.click(screen.getByRole("button", { name: "GitHub Projects" }));
    const dialog = screen.getByRole("dialog", { name: "GitHub" });
    const firstJoke = within(dialog).getByRole("heading", { level: 3 }).textContent!;
    expect(firstJoke).not.toBe(CODING_JOKES[0]);
    fireEvent.click(within(dialog).getByRole("button", { name: firstJoke }));
    const secondJoke = within(dialog).getByRole("heading", { level: 3 }).textContent!;
    expect(CODING_JOKES).toContain(secondJoke);
    expect(secondJoke).not.toBe(firstJoke);
  } finally {
    random.mockRestore();
  }
});


test("folder tone reacts to changes in the system appearance", () => {
  const { container } = render(<PortfolioFolders />);
  expect(container.querySelector(".gf-root")?.getAttribute("data-tone")).toBe("light");
  act(() => { dark = true; changeTheme?.(); });
  expect(container.querySelector(".gf-root")?.getAttribute("data-tone")).toBe("dark");
  act(() => { dark = false; changeTheme?.(); });
  expect(container.querySelector(".gf-root")?.getAttribute("data-tone")).toBe("light");
});

test("sound is automatic and the old mute control is absent", () => {
  render(<PortfolioFolders />);
  expect(screen.queryByRole("switch", { name: "Sound effects" })).toBeNull();
});


test("an unavailable GitHub calendar offers retry without showing sample contributions", async () => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error("GitHub unavailable")).mockImplementation(() => new Promise(() => {})) as unknown as typeof fetch;
  render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Projects, 5 items" }));
  fireEvent.click(screen.getByRole("button", { name: "GitHub Projects" }));
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.queryByRole("img")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(screen.getByText("Loading contributions from GitHub…")).toBeTruthy();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test("preview flight begins at the selected card and restores it when unmounted", () => {
  const bounds = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    return { x: 140, y: 250, left: 140, top: 250, right: 412, bottom: 434, width: 272, height: 184, toJSON: () => ({}) };
  });
  const { container, unmount } = render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Projects, 5 items" }));
  const card = screen.getByRole("button", { name: "QuestGPT GitHub" });
  fireEvent.click(card);
  expect(card.hasAttribute("data-preview-source")).toBe(true);
  const flight = container.querySelector<HTMLElement>(".preview-flight-card");
  expect(flight?.style.width).toBe("272px");
  expect(flight?.style.height).toBe("184px");
  expect(flight?.querySelector("img")?.getAttribute("src")).toBe("/projects/questgpt.png");
  unmount();
  expect(card.hasAttribute("data-preview-source")).toBe(false);
  bounds.mockRestore();
});

test("repository icon shares the tags row and dismissing a preview starts its return to the source", () => {
  const bounds = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ x: 100, y: 100, left: 100, top: 100, right: 372, bottom: 284, width: 272, height: 184, toJSON: () => ({}) });
  const { container, unmount } = render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Projects, 5 items" }));
  fireEvent.click(screen.getByRole("button", { name: "QuestGPT GitHub" }));
  const repository = screen.getByRole("link", { name: "View Repository" });
  expect(repository.closest(".project-tags")).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Close project" }));
  expect(screen.getByRole("dialog").hasAttribute("data-returning")).toBe(true);
  expect(container.querySelector(".preview-flight-return")).not.toBeNull();
  unmount();
  bounds.mockRestore();
});

test("return animates transforms without resizing the card and releases its landing lock on interaction", () => {
  const bounds = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ x: 100, y: 100, left: 100, top: 100, right: 372, bottom: 284, width: 272, height: 184, toJSON: () => ({}) });
  const { container, unmount } = render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Projects, 5 items" }));
  const source = screen.getByRole("button", { name: "QuestGPT GitHub" });
  fireEvent.click(source);
  fireEvent.click(screen.getByRole("button", { name: "Close project" }));
  const flight = container.querySelector<HTMLElement>(".preview-flight-return");
  expect(flight?.style.width).toBe("272px");
  expect(flight?.style.height).toBe("184px");
  expect(source.hasAttribute("data-preview-restoring")).toBe(true);
  fireEvent.keyDown(source, { key: "Tab" });
  expect(source.hasAttribute("data-preview-restoring")).toBe(false);
  unmount();
  bounds.mockRestore();
});
