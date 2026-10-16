export type PortfolioSound = "click" | "folder-open" | "folder-close" | "card-open" | "card-close";

export function playPortfolioSound(context: AudioContext, sound: PortfolioSound) {
  const opening = sound.endsWith("open");
  const folder = sound.startsWith("folder");
  const click = sound === "click";
  const now = context.currentTime;
  const duration = click ? .055 : folder ? .14 : .11;
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);

  const paper = context.createBufferSource();
  paper.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = .6;
  filter.frequency.setValueAtTime(click ? 2400 : opening ? 1700 : 1100, now);
  filter.frequency.exponentialRampToValueAtTime(click ? 800 : opening ? 1100 : 600, now + duration);
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(click ? .025 : .035, now + (click ? .002 : .008));
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  paper.connect(filter).connect(gain).connect(context.destination);
  paper.start(now);
  paper.stop(now + duration);
  paper.onended = () => { paper.disconnect(); filter.disconnect(); gain.disconnect(); };

  if (!folder) {
    const tone = context.createOscillator();
    const toneGain = context.createGain();
    const toneDuration = click ? .045 : .09;
    tone.type = "sine";
    tone.frequency.setValueAtTime(click ? 700 : opening ? 440 : 620, now);
    tone.frequency.exponentialRampToValueAtTime(click ? 260 : opening ? 620 : 360, now + toneDuration);
    toneGain.gain.setValueAtTime(0, now);
    toneGain.gain.linearRampToValueAtTime(click ? .03 : .02, now + (click ? .002 : .008));
    toneGain.gain.exponentialRampToValueAtTime(.0001, now + toneDuration);
    tone.connect(toneGain).connect(context.destination);
    tone.start(now);
    tone.stop(now + toneDuration + .01);
    tone.onended = () => { tone.disconnect(); toneGain.disconnect(); };
  }
}
