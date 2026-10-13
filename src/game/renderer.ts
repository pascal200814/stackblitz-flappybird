import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BIRD_X,
  BIRD_RADIUS,
  PIPE_WIDTH,
  GROUND_HEIGHT,
  type GameState,
} from "./engine";

const SKY_TOP = "#4ec0ca";
const SKY_BOTTOM = "#71c5cf";

const CLOUD_COLOR = "rgba(255,255,255,0.5)";

const BIRD_BODY = "#f7d51d";
const BIRD_BODY_DARK = "#c9a200";
const BIRD_WING = "#fff";
const BIRD_WING_DARK = "#ddd";
const BIRD_EYE_WHITE = "#fff";
const BIRD_PUPIL = "#222";
const BIRD_BEAK = "#f29030";
const BIRD_BEAK_DARK = "#d4731a";

const PIPE_BODY = "#73bf2e";
const PIPE_DARK = "#3a6b1a";
const PIPE_LIGHT = "#9ce046";
const PIPE_HIGHLIGHT = "#b8f060";
const PIPE_BORDER = "#2d5212";

const GROUND_GRASS = "#8ec649";
const GROUND_GRASS_DARK = "#6ba83a";
const GROUND_TOP = "#ded895";
const GROUND_DIRT = "#d9a857";
const GROUND_DIRT_DARK = "#c49a4a";

const BUSH_COLOR = "#5fa831";
const BUSH_DARK = "#4a8326";

const HILL_FAR = "rgba(255,255,255,0.15)";
const HILL_NEAR = "rgba(255,255,255,0.22)";

function drawSky(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT - GROUND_HEIGHT);
  grad.addColorStop(0, SKY_TOP);
  grad.addColorStop(1, SKY_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT);
}

function drawHills(ctx: CanvasRenderingContext2D, offset: number, yBase: number, color: string, amplitude: number, spacing: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, yBase);
  for (let x = 0; x <= CANVAS_WIDTH + spacing; x += 4) {
    const phase = ((x + offset) % spacing) / spacing;
    const y = yBase - Math.sin(phase * Math.PI * 2) * amplitude;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(CANVAS_WIDTH, yBase);
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT);
  ctx.lineTo(0, CANVAS_HEIGHT - GROUND_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = CLOUD_COLOR;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.7, y + r * 0.2, r * 0.8, 0, Math.PI * 2);
  ctx.arc(x - r * 0.7, y + r * 0.2, r * 0.7, 0, Math.PI * 2);
  ctx.arc(x + r * 1.2, y - r * 0.1, r * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawClouds(ctx: CanvasRenderingContext2D, offset: number) {
  const clouds: [number, number, number, number][] = [
    [60, 90, 28, 0.5],
    [200, 130, 22, 0.4],
    [340, 75, 18, 0.35],
    [480, 110, 26, 0.45],
  ];
  const totalWidth = CANVAS_WIDTH + 200;
  for (const [baseX, cy, r, alpha] of clouds) {
    let x = ((baseX - offset) % totalWidth + totalWidth) % totalWidth;
    if (x > CANVAS_WIDTH + 60) x -= totalWidth;
    drawCloud(ctx, x, cy, r, alpha);
  }
}

function drawBushes(ctx: CanvasRenderingContext2D, offset: number) {
  const y = CANVAS_HEIGHT - GROUND_HEIGHT;
  ctx.fillStyle = BUSH_DARK;
  for (let i = -1; i < CANVAS_WIDTH / 45 + 2; i++) {
    const x = i * 45 - (offset % 45);
    ctx.beginPath();
    ctx.arc(x, y + 2, 24, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillStyle = BUSH_COLOR;
  for (let i = -1; i < CANVAS_WIDTH / 45 + 2; i++) {
    const x = i * 45 - (offset % 45);
    ctx.beginPath();
    ctx.arc(x, y - 2, 22, Math.PI, 0);
    ctx.fill();
  }
}

function drawPipe(ctx: CanvasRenderingContext2D, pipe: GameState["pipes"][0]) {
  const x = pipe.x;
  const topH = pipe.gapY;
  const bottomY = pipe.gapY + pipe.gapHeight;
  const bottomH = CANVAS_HEIGHT - GROUND_HEIGHT - bottomY;

  const bodyGrad = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
  bodyGrad.addColorStop(0, PIPE_DARK);
  bodyGrad.addColorStop(0.12, PIPE_LIGHT);
  bodyGrad.addColorStop(0.3, PIPE_BODY);
  bodyGrad.addColorStop(0.7, PIPE_BODY);
  bodyGrad.addColorStop(0.88, PIPE_LIGHT);
  bodyGrad.addColorStop(1, PIPE_DARK);

  // Top pipe body
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(x, 0, PIPE_WIDTH, topH - 22);
  // Top pipe cap
  const capGrad = ctx.createLinearGradient(x - 5, 0, x + PIPE_WIDTH + 5, 0);
  capGrad.addColorStop(0, PIPE_DARK);
  capGrad.addColorStop(0.15, PIPE_LIGHT);
  capGrad.addColorStop(0.5, PIPE_BODY);
  capGrad.addColorStop(0.85, PIPE_BODY);
  capGrad.addColorStop(1, PIPE_DARK);
  ctx.fillStyle = capGrad;
  ctx.fillRect(x - 5, topH - 22, PIPE_WIDTH + 10, 22);

  // Bottom pipe body
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(x, bottomY + 22, PIPE_WIDTH, bottomH - 22);
  // Bottom pipe cap
  ctx.fillStyle = capGrad;
  ctx.fillRect(x - 5, bottomY, PIPE_WIDTH + 10, 22);

  // Borders
  ctx.strokeStyle = PIPE_BORDER;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x + 1, 0, PIPE_WIDTH - 2, topH - 22);
  ctx.strokeRect(x - 5 + 1, topH - 22, PIPE_WIDTH + 10 - 2, 22);
  ctx.strokeRect(x + 1, bottomY + 22, PIPE_WIDTH - 2, bottomH - 22);
  ctx.strokeRect(x - 5 + 1, bottomY, PIPE_WIDTH + 10 - 2, 22);

  // Highlight stripe
  ctx.fillStyle = PIPE_HIGHLIGHT;
  ctx.fillRect(x + 8, 0, 4, topH - 22);
  ctx.fillRect(x + 8, bottomY + 22, 4, bottomH - 22);
}

function drawBirdTrail(ctx: CanvasRenderingContext2D, state: GameState) {
  for (const t of state.birdTrail) {
    ctx.globalAlpha = t.life * 0.3;
    ctx.fillStyle = BIRD_BODY;
    ctx.beginPath();
    ctx.arc(t.x, t.y, BIRD_RADIUS * t.life * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawBird(ctx: CanvasRenderingContext2D, state: GameState) {
  const { birdY, birdRotation, frameCount, isPlaying } = state;

  ctx.save();
  ctx.translate(BIRD_X, birdY);
  ctx.rotate((birdRotation * Math.PI) / 180);

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  // Body
  ctx.fillStyle = BIRD_BODY;
  ctx.beginPath();
  ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Belly
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.arc(2, 6, BIRD_RADIUS * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Wing — flaps faster when playing
  const wingSpeed = isPlaying ? 0.45 : 0.25;
  const wingFlap = Math.sin(frameCount * wingSpeed) * (isPlaying ? 7 : 5);
  ctx.fillStyle = BIRD_WING;
  ctx.beginPath();
  ctx.ellipse(-7, 2 + wingFlap, 11, 7.5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = BIRD_WING_DARK;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Wing detail
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(-7, 2 + wingFlap, 7, 4, -0.2, 0, Math.PI * 2);
  ctx.stroke();

  // Eye
  ctx.fillStyle = BIRD_EYE_WHITE;
  ctx.beginPath();
  ctx.arc(8, -7, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BIRD_PUPIL;
  ctx.beginPath();
  ctx.arc(10, -7, 3.2, 0, Math.PI * 2);
  ctx.fill();
  // Eye glint
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(9, -8, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = BIRD_BEAK;
  ctx.beginPath();
  ctx.moveTo(14, -3);
  ctx.lineTo(25, 0);
  ctx.lineTo(14, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = BIRD_BEAK_DARK;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Beak line
  ctx.strokeStyle = BIRD_BEAK_DARK;
  ctx.beginPath();
  ctx.moveTo(14, 0.5);
  ctx.lineTo(25, 0);
  ctx.stroke();

  // Body outline
  ctx.strokeStyle = BIRD_BODY_DARK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, offset: number) {
  const y = CANVAS_HEIGHT - GROUND_HEIGHT;

  // Grass top edge
  ctx.fillStyle = GROUND_GRASS;
  ctx.fillRect(0, y, CANVAS_WIDTH, 6);
  ctx.fillStyle = GROUND_GRASS_DARK;
  ctx.fillRect(0, y + 6, CANVAS_WIDTH, 4);

  // Sand/topsoil
  ctx.fillStyle = GROUND_TOP;
  ctx.fillRect(0, y + 10, CANVAS_WIDTH, 10);

  // Dirt
  const dirtGrad = ctx.createLinearGradient(0, y + 20, 0, CANVAS_HEIGHT);
  dirtGrad.addColorStop(0, GROUND_DIRT);
  dirtGrad.addColorStop(1, GROUND_DIRT_DARK);
  ctx.fillStyle = dirtGrad;
  ctx.fillRect(0, y + 20, CANVAS_WIDTH, GROUND_HEIGHT - 20);

  // Diagonal ground pattern
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 3;
  for (let i = -2; i < CANVAS_WIDTH / 20 + 2; i++) {
    const baseX = i * 20 - (offset % 20);
    ctx.beginPath();
    ctx.moveTo(baseX, y + 20);
    ctx.lineTo(baseX + 12, CANVAS_HEIGHT);
    ctx.stroke();
  }

  // Grass blades on top
  ctx.fillStyle = GROUND_GRASS;
  for (let i = 0; i < CANVAS_WIDTH / 12 + 2; i++) {
    const baseX = i * 12 - (offset % 12);
    ctx.beginPath();
    ctx.moveTo(baseX, y);
    ctx.lineTo(baseX + 3, y - 5);
    ctx.lineTo(baseX + 6, y);
    ctx.closePath();
    ctx.fill();
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, state: GameState) {
  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFloatingScores(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.textAlign = "center";
  for (const fs of state.floatingScores) {
    ctx.globalAlpha = Math.max(0, fs.life);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 3;
    ctx.strokeText(`+${fs.value}`, fs.x, fs.y);
    ctx.fillText(`+${fs.value}`, fs.x, fs.y);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "start";
}

export function render(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.save();

  if (state.screenShake > 0) {
    const sx = (Math.random() - 0.5) * state.screenShake;
    const sy = (Math.random() - 0.5) * state.screenShake;
    ctx.translate(sx, sy);
  }

  ctx.clearRect(-20, -20, CANVAS_WIDTH + 40, CANVAS_HEIGHT + 40);

  drawSky(ctx);
  drawClouds(ctx, state.cloudOffset);
  drawHills(ctx, state.cloudOffset * 0.3, CANVAS_HEIGHT - GROUND_HEIGHT - 50, HILL_FAR, 25, 200);
  drawHills(ctx, state.cloudOffset * 0.6, CANVAS_HEIGHT - GROUND_HEIGHT - 30, HILL_NEAR, 18, 150);

  for (const pipe of state.pipes) {
    drawPipe(ctx, pipe);
  }

  drawBushes(ctx, state.bushOffset);
  drawGround(ctx, state.groundOffset);

  if (!state.isDead) drawBirdTrail(ctx, state);
  drawBird(ctx, state);
  drawParticles(ctx, state);
  drawFloatingScores(ctx, state);

  // Death flash
  if (state.deathFlash > 0) {
    ctx.globalAlpha = state.deathFlash * 0.6;
    ctx.fillStyle = "#fff";
    ctx.fillRect(-20, -20, CANVAS_WIDTH + 40, CANVAS_HEIGHT + 40);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}
