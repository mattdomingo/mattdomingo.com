import { expect, test, beforeEach } from "@jest/globals";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import PortfolioFolders from "@/components/portfolio-folders";



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
  ["QuestGPT", "QuestGPT GitHub", "Explore QuestGPT", "https://github.com/mattdomingo/QuestGPT"],
  ["Recall", "Recall GitHub", "Explore Recall", "https://github.com/mattdomingo/speedhacks"],
  ["Multiplayer AI", "Multiplayer AI Open source soon", "View repository", "https://github.com/mattdomingo/openfloor"],
  ["openfloor", "openfloor opnflr.com", "Visit openfloor", "https://opnflr.com"],
])("%s opens an in-page summary and image with a new-tab destination", (name, tile, link, url) => {
  render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Project, 5 items" }));
  fireEvent.click(screen.getByRole("button", { name: tile, exact: true }));
  const dialog = screen.getByRole("dialog", { name });
  expect(within(dialog).getByRole("heading", { level: 3 })).toBeTruthy();
  expect(within(dialog).getByRole("img")).toBeTruthy();
  const destination = within(dialog).getByRole("link", { name: new RegExp(link) });
  expect(destination.getAttribute("href")).toBe(url);
  expect(destination.getAttribute("target")).toBe("_blank");
});

test("GitHub opens the skyline, and connect links open in a new tab with the revised email label", () => {
  render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Project, 5 items" }));
  fireEvent.click(screen.getByRole("button", { name: "GitHub Projects" }));
  expect(within(screen.getByRole("dialog", { name: "GitHub" })).getByText("Loading contributions from GitHub…")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Open Connect, 4 items" }));
  expect(screen.getByRole("link", { name: "Email Say wassup" }).getAttribute("href")).toBe("mailto:matthew.domingo2022@gmail.com");
  for (const anchor of screen.getAllByRole("link")) expect(anchor.getAttribute("target")).toBe("_blank");
});


test("folder tone reacts to changes in the system appearance", () => {
  const { container } = render(<PortfolioFolders />);
  expect(container.querySelector(".gf-root")?.getAttribute("data-tone")).toBe("light");
  act(() => { dark = true; changeTheme?.(); });
  expect(container.querySelector(".gf-root")?.getAttribute("data-tone")).toBe("dark");
  act(() => { dark = false; changeTheme?.(); });
  expect(container.querySelector(".gf-root")?.getAttribute("data-tone")).toBe("light");
});


test("an unavailable GitHub calendar offers retry without showing sample contributions", async () => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error("GitHub unavailable")).mockImplementation(() => new Promise(() => {})) as unknown as typeof fetch;
  render(<PortfolioFolders />);
  fireEvent.click(screen.getByRole("button", { name: "Open Project, 5 items" }));
  fireEvent.click(screen.getByRole("button", { name: "GitHub Projects" }));
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.queryByRole("img")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(screen.getByText("Loading contributions from GitHub…")).toBeTruthy();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});
