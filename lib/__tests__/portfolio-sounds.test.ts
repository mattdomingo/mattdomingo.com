import { playPortfolioSound, type PortfolioSound } from "@/lib/portfolio-sounds";

test.each<PortfolioSound>(["folder-open", "folder-close", "card-open", "card-close"])("%s schedules a quiet, short sound and releases its audio nodes", (sound) => {
  const parameter = () => ({ setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() });
  const connection = () => ({ connect: jest.fn((next) => next), disconnect: jest.fn() });
  const samples = new Float32Array(7000);
  const paper = { ...connection(), start: jest.fn(), stop: jest.fn(), onended: null as null | (() => void) };
  const tone = { ...connection(), frequency: parameter(), start: jest.fn(), stop: jest.fn(), onended: null as null | (() => void) };
  const filter = { ...connection(), frequency: parameter(), Q: { value: 0 } };
  const gains: ReturnType<typeof parameter>[] = [];
  const context = {
    currentTime: 2, sampleRate: 48000, destination: {},
    createBuffer: () => ({ getChannelData: () => samples }),
    createBufferSource: () => paper,
    createBiquadFilter: () => filter,
    createGain: () => { const gain = parameter(); gains.push(gain); return { ...connection(), gain }; },
    createOscillator: jest.fn(() => tone),
  };
  playPortfolioSound(context as unknown as AudioContext, sound);
  expect(paper.start).toHaveBeenCalledWith(2);
  expect(paper.stop.mock.calls[0][0]).toBeLessThanOrEqual(2.15);
  expect(samples.every((value) => Number.isFinite(value) && Math.abs(value) <= 1)).toBe(true);
  for (const gain of gains) expect(gain.linearRampToValueAtTime.mock.calls[0][0]).toBeLessThanOrEqual(.035);
  expect(context.createOscillator).toHaveBeenCalledTimes(sound.startsWith("card") ? 1 : 0);
  paper.onended?.();
  tone.onended?.();
  expect(paper.disconnect).toHaveBeenCalled();
  expect(filter.disconnect).toHaveBeenCalled();
});
