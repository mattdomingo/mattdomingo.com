import { act, fireEvent, render, renderHook } from "@testing-library/react";
import { usePortfolioAudio } from "@/hooks/use-portfolio-audio";
import { playPortfolioSound } from "@/lib/portfolio-sounds";

jest.mock("@/lib/portfolio-sounds", () => ({ playPortfolioSound: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

test("every click sounds once, including stopped events, nested controls, blank space, and keyboard activation", () => {
  const original = window.AudioContext;
  const context = { state: "running", close: jest.fn().mockResolvedValue(undefined) } as unknown as AudioContext;
  window.AudioContext = jest.fn(() => context) as unknown as typeof AudioContext;
  function Page() {
    usePortfolioAudio();
    return <button onClick={(event) => event.stopPropagation()}><span>Tap</span></button>;
  }
  const { getByText, unmount } = render(<Page />);
  try {
    fireEvent.click(getByText("Tap"), { pointerType: "touch" });
    fireEvent.click(document.body);
    fireEvent.click(getByText("Tap"), { detail: 0 });
    expect(playPortfolioSound).toHaveBeenCalledTimes(3);
    expect(playPortfolioSound).toHaveBeenLastCalledWith(context, "click");
    fireEvent.pointerMove(document.body);
    fireEvent.scroll(window);
    expect(playPortfolioSound).toHaveBeenCalledTimes(3);
    unmount();
    fireEvent.click(document.body);
    expect(playPortfolioSound).toHaveBeenCalledTimes(3);
  } finally {
    unmount();
    window.AudioContext = original;
  }
});

test("unavailable audio never blocks a click handler", () => {
  const original = window.AudioContext;
  window.AudioContext = jest.fn(() => { throw new Error("Audio unavailable"); }) as unknown as typeof AudioContext;
  const navigate = jest.fn();
  function Page() { usePortfolioAudio(); return <button onClick={navigate}>Go</button>; }
  const { getByText, unmount } = render(<Page />);
  try {
    fireEvent.click(getByText("Go"));
    expect(navigate).toHaveBeenCalledTimes(1);
  } finally {
    unmount();
    window.AudioContext = original;
  }
});

test("sounds start on interaction even with an old mute preference, and release audio on unmount", () => {
  const original = window.AudioContext;
  const context = { state: "suspended", resume: jest.fn().mockResolvedValue(undefined), close: jest.fn().mockResolvedValue(undefined) } as unknown as AudioContext;
  const create = jest.fn(() => context);
  window.AudioContext = create as unknown as typeof AudioContext;
  localStorage.clear();
  localStorage.setItem("portfolio-sounds", "off");
  try {
    const first = renderHook(() => usePortfolioAudio());
    expect(create).not.toHaveBeenCalled();
    act(() => first.result.current.play("folder-open"));
    expect(context.resume).toHaveBeenCalledTimes(1);
    expect(playPortfolioSound).toHaveBeenCalledWith(context, "folder-open");
    expect(context.close).not.toHaveBeenCalled();
    first.unmount();
    expect(context.close).toHaveBeenCalledTimes(1);
    const second = renderHook(() => usePortfolioAudio());
    act(() => second.result.current.play("card-close"));
    expect(create).toHaveBeenCalledTimes(2);
    expect(playPortfolioSound).toHaveBeenLastCalledWith(context, "card-close");
    second.unmount();
  } finally {
    window.AudioContext = original;
    localStorage.clear();
  }
});

test("background music waits for interaction, retries blocked playback, and stops on unmount", async () => {
  let paused = true;
  const play = jest.spyOn(HTMLMediaElement.prototype, "play")
    .mockImplementation(() => { paused = false; return Promise.resolve(); })
    .mockRejectedValueOnce(new Error("Playback blocked"));
  const pause = jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => { paused = true; });
  jest.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(() => paused);
  function Player() {
    const { musicRef } = usePortfolioAudio();
    return <audio ref={musicRef} />;
  }
  const { unmount } = render(<Player />);
  try {
    expect(play).not.toHaveBeenCalled();
    await act(async () => { fireEvent.click(window); });
    expect(play).toHaveBeenCalledTimes(1);
    await act(async () => { fireEvent.keyDown(window, { key: "Enter" }); });
    expect(play).toHaveBeenCalledTimes(2);
    fireEvent.click(window);
    expect(play).toHaveBeenCalledTimes(2);
    unmount();
    expect(pause).toHaveBeenCalledTimes(1);
    fireEvent.click(window);
    expect(play).toHaveBeenCalledTimes(2);
  } finally {
    unmount();
    jest.restoreAllMocks();
  }
});
