let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

export function resumeAudio() {
  const ctx = getCtx();
  if (ctx && ctx.state === "suspended") ctx.resume();
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.15,
  freqEnd?: number,
) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(0.01, freqEnd), ctx.currentTime + duration);
  }

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playFlap() {
  playTone(180, 0.12, "square", 0.08, 280);
}

export function playScore() {
  playTone(660, 0.08, "square", 0.1);
  setTimeout(() => playTone(880, 0.1, "square", 0.1), 60);
}

export function playHit() {
  playTone(200, 0.15, "sawtooth", 0.15, 80);
}

export function playDie() {
  playTone(400, 0.3, "sawtooth", 0.12, 60);
  setTimeout(() => playTone(150, 0.4, "sawtooth", 0.1, 40), 100);
}

export function playMedal() {
  playTone(523, 0.1, "sine", 0.1);
  setTimeout(() => playTone(659, 0.1, "sine", 0.1), 80);
  setTimeout(() => playTone(784, 0.15, "sine", 0.12), 160);
}
