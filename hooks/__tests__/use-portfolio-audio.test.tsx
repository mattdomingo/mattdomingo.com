import { act, renderHook } from "@testing-library/react";
import { usePortfolioAudio } from "@/hooks/use-portfolio-audio";
import { playPortfolioSound } from "@/lib/portfolio-sounds";

jest.mock("@/lib/portfolio-sounds", () => ({ playPortfolioSound: jest.fn() }));

test("sounds start on interaction, mute stops audio, and the preference survives remounting", () => {
  const original = window.AudioContext;
  const context = { state: "suspended", resume: jest.fn().mockResolvedValue(undefined), close: jest.fn().mockResolvedValue(undefined) } as unknown as AudioContext;
  const create = jest.fn(() => context);
  window.AudioContext = create as unknown as typeof AudioContext;
  localStorage.clear();
  try {
    const first = renderHook(() => usePortfolioAudio());
    expect(create).not.toHaveBeenCalled();
    act(() => first.result.current.play("folder-open"));
    expect(context.resume).toHaveBeenCalledTimes(1);
    expect(playPortfolioSound).toHaveBeenCalledWith(context, "folder-open");
    act(() => first.result.current.toggle());
    expect(first.result.current.enabled).toBe(false);
    expect(context.close).toHaveBeenCalledTimes(1);
    act(() => first.result.current.play("card-open"));
    expect(playPortfolioSound).toHaveBeenCalledTimes(1);
    first.unmount();
    const second = renderHook(() => usePortfolioAudio());
    expect(second.result.current.enabled).toBe(false);
    act(() => second.result.current.toggle());
    act(() => second.result.current.play("card-close"));
    expect(create).toHaveBeenCalledTimes(2);
    expect(playPortfolioSound).toHaveBeenLastCalledWith(context, "card-close");
    second.unmount();
  } finally {
    window.AudioContext = original;
    localStorage.clear();
  }
});
