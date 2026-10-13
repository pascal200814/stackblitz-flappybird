<script lang="ts">
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    createInitialState,
    flap,
    tick,
    type GameState,
  } from "./game/engine";
  import { render } from "./game/renderer";
  import { resumeAudio, playFlap, playScore, playHit, playDie, playMedal } from "./game/sound";
  import StartScreen from "./components/StartScreen.svelte";
  import GameOverScreen from "./components/GameOverScreen.svelte";

  const HIGH_SCORE_KEY = "flappy-high-score";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let state: GameState = createInitialState();
  let pipeId = 0;
  let animFrame = 0;

  let score = 0;
  let isDead = false;
  let hasStarted = false;
  let highScore = 0;
  let isNewHigh = false;
  let isPaused = false;
  let soundEnabled = true;


  function handleInput() {
    if (state.isDead || isPaused) return;
    resumeAudio();
    if (!state.hasStarted) {
      state = flap(state);
      if (soundEnabled) playFlap();
    } else {
      state = flap(state);
      if (soundEnabled) playFlap();
    }
  }

  function reset() {
    state = createInitialState();
    pipeId = 0;
    score = 0;
    isDead = false;
    hasStarted = false;
    isNewHigh = false;
    isPaused = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      handleInput();
    } else if (e.code === "KeyP" || e.code === "Escape") {
      e.preventDefault();
      if (hasStarted && !isDead) isPaused = !isPaused;
    } else if (e.code === "KeyM") {
      e.preventDefault();
      soundEnabled = !soundEnabled;
    } else if (e.code === "Enter" && isDead) {
      e.preventDefault();
      reset();
    }
  }

  function handleCanvasPointer(e: PointerEvent) {
    e.preventDefault();
    handleInput();
  }

  onMount(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (saved) highScore = parseInt(saved, 10) || 0;

    const savedSound = localStorage.getItem("flappy-sound");
    if (savedSound !== null) soundEnabled = savedSound === "true";

    ctx = canvas.getContext("2d")!;

    const loop = () => {
      if (!isPaused) {
        const { state: next } = tick(state, pipeId);

        if (next.score !== state.score) {
          score = next.score;
          if (soundEnabled) playScore();
        }

        if (next.hasStarted && !state.hasStarted) hasStarted = true;

        if (next.isDead && !state.isDead) {
          isDead = true;
          if (soundEnabled) {
            playHit();
            setTimeout(() => playDie(), 80);
          }
          if (next.score > highScore) {
            highScore = next.score;
            isNewHigh = true;
            localStorage.setItem(HIGH_SCORE_KEY, String(next.score));
            if (soundEnabled) setTimeout(() => playMedal(), 400);
          }
        }

        state = next;
      }

      render(ctx, state);
      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);

    window.addEventListener("keydown", handleKeydown);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem("flappy-sound", String(soundEnabled));
  }

  function togglePause() {
    if (hasStarted && !isDead) isPaused = !isPaused;
  }
</script>

<div class="outer">
  <div class="game-wrapper">
    <!-- Top bar -->
    <div class="top-bar">
      <button class="icon-btn" on:click={toggleSound} aria-label="Toggle sound">
        {#if soundEnabled}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        {:else}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        {/if}
      </button>

      {#if hasStarted && !isDead && !isPaused}
        <div class="live-score" transition:fade={{ duration: 200 }}>
          <span class="live-score-number">{score}</span>
        </div>
      {/if}

      <button class="icon-btn" on:click={togglePause} aria-label="Toggle pause" disabled={!hasStarted || isDead}>
        {#if isPaused}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        {:else}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        {/if}
      </button>
    </div>

    <!-- Game canvas -->
    <div class="game-container">
      <canvas
        bind:this={canvas}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        class="game-canvas"
        on:pointerdown={handleCanvasPointer}
      ></canvas>

      {#if !hasStarted && !isDead}
        <div class="overlay" transition:fade={{ duration: 200 }}>
          <StartScreen highScore={highScore} />
        </div>
      {/if}

      {#if isDead}
        <div class="overlay" transition:fade={{ duration: 300 }}>
          <div on:click={reset} role="button" tabindex="0" on:keydown={(e) => e.key === "Enter" && reset()}>
            <GameOverScreen {score} {highScore} {isNewHigh} />
          </div>
        </div>
      {/if}

      {#if isPaused}
        <div class="overlay" transition:fade={{ duration: 200 }}>
          <div class="pause-card" in:scale={{ duration: 250, start: 0.8 }}>
            <h2 class="pause-title">Paused</h2>
            <p class="pause-hint">Press P to resume</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- Footer hint -->
    <div class="footer-hint">
      <span>P to pause</span>
      <span>M to mute</span>
      <span>Enter to restart</span>
    </div>
  </div>
</div>

<style>
  .outer {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #1a3050 0%, #2a4d6e 50%, #1d3a5c 100%);
    padding: 16px;
  }

  .outer::before {
    content: "";
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, rgba(78, 192, 202, 0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .game-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .top-bar {
    width: 400px;
    max-width: 100vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    padding: 0 4px;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: all 0.15s ease;
    backdrop-filter: blur(4px);
  }

  .icon-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    transform: translateY(-1px);
  }

  .icon-btn:active:not(:disabled) {
    transform: scale(0.92);
  }

  .icon-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .live-score {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .live-score-number {
    font-size: 38px;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.4);
    line-height: 1;
  }

  .game-container {
    position: relative;
    width: 400px;
    height: 600px;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 100px);
    aspect-ratio: 400 / 600;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .game-canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    image-rendering: auto;
    touch-action: none;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(3px);
  }

  .pause-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 28px 48px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .pause-title {
    font-size: 24px;
    font-weight: 800;
    color: #e8861c;
    letter-spacing: 1px;
    margin: 0;
  }

  .pause-hint {
    font-size: 13px;
    color: #999;
    font-weight: 500;
    margin: 0;
  }

  .footer-hint {
    display: flex;
    gap: 16px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  @media (max-width: 420px) {
    .top-bar {
      width: 100%;
    }

    .footer-hint {
      font-size: 10px;
      gap: 12px;
    }
  }
</style>
