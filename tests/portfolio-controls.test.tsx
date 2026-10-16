import { expect, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectArchive } from "@/components/project-archive";
import { ResumeViewer } from "@/components/resume-viewer";

test("technology filtering retains matching destinations and can be reset", () => {
  render(<ProjectArchive />);
  expect(
    screen.getByRole("heading", { name: "Openfloor" }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Filter by technology"), {
    target: { value: "MuJoCo" },
  });
  expect(screen.getByRole("status")).toHaveTextContent("01 PROJECTS");
  expect(
    screen.getByRole("heading", { name: "mujoco-sandbox" }).closest("a"),
  ).toHaveAttribute("href", "/projects/15");
  expect(
    screen.queryByRole("heading", { name: "Openfloor" }),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Filter by technology"), {
    target: { value: "All" },
  });
  expect(screen.getByRole("status")).toHaveTextContent("17 PROJECTS");
});

test("résumé selection updates both the viewer and direct download", () => {
  render(<ResumeViewer />);
  expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
    "href",
    "/documents/resume.pdf",
  );
  fireEvent.click(screen.getByRole("button", { name: "Applied AI" }));
  expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
    "href",
    "/documents/resume-applied-ai.pdf",
  );
  expect(screen.getByRole("link", { name: "Open PDF" })).toHaveAttribute(
    "href",
    "/documents/resume-applied-ai.pdf",
  );
  expect(
    screen.getByTitle("Matthew Domingo — Applied AI résumé"),
  ).toHaveAttribute("src", "/documents/resume-applied-ai.pdf#view=FitH");
});
