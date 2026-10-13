export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;

export const GRAVITY = 0.45;
export const JUMP_VELOCITY = -7.5;
export const PIPE_WIDTH = 70;
export const BASE_PIPE_GAP = 170;
export const MIN_PIPE_GAP = 130;
export const BASE_PIPE_SPEED = 2.5;
export const MAX_PIPE_SPEED = 4.5;
export const PIPE_SPACING = 220;

export const BIRD_X = 100;
export const BIRD_RADIUS = 18;

export const GROUND_HEIGHT = 80;
export const GROUND_SCROLL_SPEED = 2.5;

export const BIRD_IDLE_AMPLITUDE = 8;
export const BIRD_IDLE_SPEED = 0.08;

export interface Pipe {
  x: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
  id: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface FloatingScore {
  x: number;
  y: number;
  life: number;
  value: number;
}

export interface GameState {
  birdY: number;
  birdVelocity: number;
  birdRotation: number;
  pipes: Pipe[];
  particles: Particle[];
  floatingScores: FloatingScore[];
  score: number;
  isPlaying: boolean;
  isDead: boolean;
  hasStarted: boolean;
  groundOffset: number;
  cloudOffset: number;
  bushOffset: number;
  frameCount: number;
  screenShake: number;
  deathFlash: number;
  birdTrail: { x: number; y: number; life: number }[];
  pipeSpeed: number;
  pipeGap: number;
  idleY: number;
}

export function createInitialState(): GameState {
  const startY = CANVAS_HEIGHT / 2 - 50;
  return {
    birdY: startY,
    birdVelocity: 0,
    birdRotation: 0,
    pipes: [],
    particles: [],
    floatingScores: [],
    score: 0,
    isPlaying: false,
    isDead: false,
    hasStarted: false,
    groundOffset: 0,
    cloudOffset: 0,
    bushOffset: 0,
    frameCount: 0,
    screenShake: 0,
    deathFlash: 0,
    birdTrail: [],
    pipeSpeed: BASE_PIPE_SPEED,
    pipeGap: BASE_PIPE_GAP,
    idleY: startY,
  };
}

export function flap(state: GameState): GameState {
  if (state.isDead) return state;
  return {
    ...state,
    hasStarted: true,
    isPlaying: true,
    birdVelocity: JUMP_VELOCITY,
  };
}

function getDifficulty(score: number) {
  const speed = Math.min(MAX_PIPE_SPEED, BASE_PIPE_SPEED + score * 0.08);
  const gap = Math.max(MIN_PIPE_GAP, BASE_PIPE_GAP - score * 2);
  return { speed, gap };
}

function checkCollision(state: GameState): boolean {
  const { birdY, pipes } = state;

  if (birdY + BIRD_RADIUS >= CANVAS_HEIGHT - GROUND_HEIGHT) return true;
  if (birdY - BIRD_RADIUS <= 0) return true;

  for (const pipe of pipes) {
    const inPipeX = BIRD_X + BIRD_RADIUS > pipe.x && BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH;
    if (inPipeX) {
      const inGap =
        birdY - BIRD_RADIUS > pipe.gapY && birdY + BIRD_RADIUS < pipe.gapY + pipe.gapHeight;
      if (!inGap) return true;
    }
  }
  return false;
}

function spawnDeathParticles(birdY: number): Particle[] {
  const particles: Particle[] = [];
  const colors = ["#f7d51d", "#f29030", "#fff", "#e0b800", "#f9d342"];
  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x: BIRD_X,
      y: birdY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 1,
      maxLife: 40 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 4,
    });
  }
  return particles;
}

export function tick(state: GameState, _nextPipeId: number): { state: GameState } {
  if (state.isDead) {
    let particles = state.particles.map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.15,
      life: p.life - 1 / p.maxLife,
    }));
    particles = particles.filter((p) => p.life > 0);

    return { state: { ...state, particles, screenShake: Math.max(0, state.screenShake - 0.5), deathFlash: Math.max(0, state.deathFlash - 0.04), groundOffset: state.groundOffset } };
  }

  if (!state.isPlaying) {
    const idleY =
      CANVAS_HEIGHT / 2 - 50 + Math.sin(state.frameCount * BIRD_IDLE_SPEED) * BIRD_IDLE_AMPLITUDE;
    return { state: { ...state, birdY: idleY, idleY, birdRotation: Math.sin(state.frameCount * BIRD_IDLE_SPEED) * 5, groundOffset: (state.groundOffset + GROUND_SCROLL_SPEED) % 40, cloudOffset: (state.cloudOffset + 0.3) % (CANVAS_WIDTH + 100), bushOffset: (state.bushOffset + GROUND_SCROLL_SPEED) % 45, frameCount: state.frameCount + 1 } };
  }

  const { speed: pipeSpeed, gap: pipeGap } = getDifficulty(state.score);

  let newPipes = state.pipes.map((p) => ({ ...p, x: p.x - pipeSpeed }));

  const lastPipe = newPipes[newPipes.length - 1];
  if (!lastPipe || lastPipe.x < CANVAS_WIDTH - PIPE_SPACING) {
    const minGapY = 80;
    const maxGapY = CANVAS_HEIGHT - GROUND_HEIGHT - 80 - pipeGap;
    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
    newPipes.push({
      x: CANVAS_WIDTH + PIPE_WIDTH,
      gapY,
      gapHeight: pipeGap,
      passed: false,
      id: _nextPipeId,
    });
  }

  newPipes = newPipes.filter((p) => p.x + PIPE_WIDTH > -10);

  let score = state.score;
  let floatingScores = state.floatingScores;
  for (const pipe of newPipes) {
    if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X - BIRD_RADIUS) {
      pipe.passed = true;
      score++;
      floatingScores = [
        ...floatingScores,
        { x: BIRD_X + 30, y: state.birdY - 10, life: 1, value: 1 },
      ];
    }
  }

  floatingScores = floatingScores
    .map((fs) => ({ ...fs, y: fs.y - 1.5, life: fs.life - 0.02 }))
    .filter((fs) => fs.life > 0);

  const birdVelocity = state.birdVelocity + GRAVITY;
  const birdY = state.birdY + birdVelocity;
  const targetRotation = birdVelocity < 0 ? -25 : Math.min(90, birdVelocity * 4);
  const birdRotation = state.birdRotation + (targetRotation - state.birdRotation) * 0.15;

  let birdTrail = [...state.birdTrail, { x: BIRD_X, y: birdY, life: 1 }];
  birdTrail = birdTrail
    .map((t) => ({ ...t, life: t.life - 0.06 }))
    .filter((t) => t.life > 0)
    .slice(-12);

  const newState: GameState = {
    ...state,
    birdY,
    birdVelocity,
    birdRotation,
    pipes: newPipes,
    floatingScores,
    score,
    groundOffset: (state.groundOffset + GROUND_SCROLL_SPEED) % 40,
    cloudOffset: (state.cloudOffset + 0.3) % (CANVAS_WIDTH + 100),
    bushOffset: (state.bushOffset + GROUND_SCROLL_SPEED) % 45,
    frameCount: state.frameCount + 1,
    birdTrail,
    pipeSpeed,
    pipeGap,
  };

  if (checkCollision(newState)) {
    return { state: { ...newState, isDead: true, isPlaying: false, birdY: Math.min(birdY, CANVAS_HEIGHT - GROUND_HEIGHT - BIRD_RADIUS), screenShake: 12, deathFlash: 1, particles: spawnDeathParticles(birdY) } };
  }

  return { state: newState };
}
