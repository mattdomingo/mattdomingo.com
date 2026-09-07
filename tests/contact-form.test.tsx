import { expect, test, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import emailjs from "@emailjs/browser";

jest.mock("@emailjs/browser", () => ({
  __esModule: true,
  default: { send: jest.fn() },
}));
process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = "test-service";
process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = "test-template";
process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "test-key";
// Load after the test-only configuration. EmailJS and fetch are always mocked.
const { ContactForm } =
  require("@/components/contact-form") as typeof import("@/components/contact-form");
const send = emailjs.send as jest.Mock;

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({ ok: false });
  if (!AbortSignal.timeout)
    AbortSignal.timeout = () => new AbortController().signal;
  send.mockResolvedValue({ status: 200 });
});
afterEach(() => {
  jest.restoreAllMocks();
});

function fill() {
  render(<ContactForm />);
  fireEvent.change(screen.getByLabelText("Your name"), {
    target: { value: "Alex Morgan" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "alex@example.com" },
  });
  fireEvent.change(screen.getByLabelText("What’s on your mind?"), {
    target: { value: "Let’s talk about a software engineering role." },
  });
}

test("duplicate submissions during the legacy check send only one email", async () => {
  let resolveCheck!: (value: unknown) => void;
  (fetch as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      resolveCheck = resolve;
    }),
  );
  fill();
  const form = screen.getByRole("form");
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(fetch).toHaveBeenCalledTimes(1);
  await act(async () => {
    resolveCheck({ ok: false });
  });
  await waitFor(() => expect(send).toHaveBeenCalledTimes(1));
  expect(send).toHaveBeenCalledWith(
    "test-service",
    "test-template",
    expect.objectContaining({
      name: "Alex Morgan",
      email: "alex@example.com",
      message: "Let’s talk about a software engineering role.",
      time: expect.any(String),
    }),
    "test-key",
  );
  expect(screen.getByRole("status")).toHaveTextContent("Message sent");
  expect(screen.getByRole("button", { name: /Send again/ })).toBeDisabled();
});

test("a storage write failure still reports successful delivery and applies cooldown", async () => {
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Storage blocked");
  });
  fill();
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Message sent"),
  );
  expect(screen.getByRole("button", { name: /Send again/ })).toBeDisabled();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("a delivery failure preserves the draft and allows retry", async () => {
  send.mockRejectedValueOnce(new Error("Network unavailable"));
  fill();
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("couldn’t be sent"),
  );
  expect(screen.getByLabelText("Your name")).toHaveValue("Alex Morgan");
  expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Message sent"),
  );
  expect(send).toHaveBeenCalledTimes(2);
});

test("restores a saved cooldown before allowing delivery", () => {
  localStorage.setItem("contactFormCooldownEnd", String(Date.now() + 600000));
  fill();
  expect(screen.getByRole("button", { name: /Send again/ })).toBeDisabled();
  fireEvent.submit(screen.getByRole("form"));
  expect(send).not.toHaveBeenCalled();
});

test("the retired feature response does not send an email", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  });
  fill();
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("no longer available"),
  );
  expect(send).not.toHaveBeenCalled();
});

test("invalid email fails validation without sending", async () => {
  fill();
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "" },
  });
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("valid email address"),
  );
  expect(send).not.toHaveBeenCalled();
});
