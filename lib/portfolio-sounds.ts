export type PortfolioSound = "folder-open" | "folder-close" | "card-open" | "card-close";

export function playPortfolioSound(context: AudioContext, sound: PortfolioSound) {
  const opening = sound.endsWith("open");
  const folder = sound.startsWith("folder");
  const now = context.currentTime;
  const duration = folder ? .14 : .11;
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);

  const paper = context.createBufferSource();
  paper.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = .6;
  filter.frequency.setValueAtTime(opening ? 1700 : 1100, now);
  filter.frequency.exponentialRampToValueAtTime(opening ? 1100 : 600, now + duration);
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(.035, now + .008);
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  paper.connect(filter).connect(gain).connect(context.destination);
  paper.start(now);
  paper.stop(now + duration);
  paper.onended = () => { paper.disconnect(); filter.disconnect(); gain.disconnect(); };

  if (!folder) {
    const tone = context.createOscillator();
    const toneGain = context.createGain();
    tone.type = "sine";
    tone.frequency.setValueAtTime(opening ? 440 : 620, now);
    tone.frequency.exponentialRampToValueAtTime(opening ? 620 : 360, now + .09);
    toneGain.gain.setValueAtTime(0, now);
    toneGain.gain.linearRampToValueAtTime(.02, now + .008);
    toneGain.gain.exponentialRampToValueAtTime(.0001, now + .09);
    tone.connect(toneGain).connect(context.destination);
    tone.start(now);
    tone.stop(now + .1);
    tone.onended = () => { tone.disconnect(); toneGain.disconnect(); };
  }
}
