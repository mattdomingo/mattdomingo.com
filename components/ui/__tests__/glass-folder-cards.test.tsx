import { fireEvent, render, screen } from "@testing-library/react";
import GlassFolder, { createArtJob, ART_PRESETS } from "@/components/ui/glass-folder-cards";

test("folder opens its real links and Escape closes it and restores focus", () => {
  render(
    <GlassFolder
      label="Matt Domingo"
      appear={false}
      art="none"
      action="none"
      files={[{ name: "Résumé.pdf", href: "/documents/resume.pdf" }]}
    />,
  );
  const contents = screen.getByRole("list");
  const toggle = screen.getByRole("button", { name: "Open Matt Domingo, 1 item" });
  expect(contents).toHaveAttribute("inert");
  expect(toggle).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(contents).not.toHaveAttribute("inert");
  const resume = screen.getByRole("link", { name: "Résumé.pdf" });
  expect(resume).toHaveAttribute("href", "/documents/resume.pdf");
  resume.focus();

  fireEvent.keyDown(document, { key: "Escape" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(contents).toHaveAttribute("inert");
  expect(toggle).toHaveFocus();
});

test("interacting with a dialog leaves the folder open so its file can regain focus", () => {
  render(
    <>
      <GlassFolder label="Résumé" appear={false} art="none" action="none" files={[]} defaultOpen />
      <dialog open aria-label="Résumé viewer"><button>Close viewer</button></dialog>
    </>,
  );
  const toggle = screen.getByRole("button", { name: "Close Résumé, 0 items" });
  fireEvent.pointerDown(screen.getByRole("button", { name: "Close viewer" }));
  fireEvent.keyDown(document, { key: "Escape" });
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  screen.getByRole("dialog").removeAttribute("open");
  fireEvent.keyDown(document, { key: "Escape" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("all six files remain available, including the oldest file", () => {
  const select = jest.fn();
  render(
    <GlassFolder
      label="Photos"
      appear={false}
      art="none"
      action="none"
      defaultOpen
      onFileSelect={select}
      files={Array.from({ length: 6 }, (_, i) => ({ name: `Photo ${i + 1}`, image: `/photo-${i}.webp` }))}
    />,
  );
  expect(screen.getAllByRole("listitem")).toHaveLength(6);
  fireEvent.click(screen.getByRole("button", { name: "Photo 1" }));
  expect(select).toHaveBeenLastCalledWith(expect.objectContaining({ name: "Photo 1" }), 0, expect.any(HTMLElement));
  fireEvent.click(screen.getByRole("button", { name: "Photo 6" }));
  expect(select).toHaveBeenLastCalledWith(expect.objectContaining({ name: "Photo 6" }), 5, expect.any(HTMLElement));
});

test("folder art finishes as opaque, repeatable pixels", () => {
  const draw = () => {
    const job = createArtJob(24, 20, ART_PRESETS.aurora, 3);
    for (let i = 0; i < 20 && !job.step(4); i++) { /* finish the queued rows */ }
    expect(job.step(4)).toBe(true);
    expect(job.pixels).toHaveLength(24 * 20 * 4);
    expect(job.pixels.filter((_, i) => i % 4 === 3).every((a) => a === 255)).toBe(true);
    return job.pixels;
  };
  expect(draw()).toEqual(draw());
});
