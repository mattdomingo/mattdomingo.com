import { act, renderHook } from "@testing-library/react";
import { usePortfolioAudio } from "@/hooks/use-portfolio-audio";
import { playPortfolioSound } from "@/lib/portfolio-sounds";

jest.mock("@/lib/portfolio-sounds", () => ({ playPortfolioSound: jest.fn() }));

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
