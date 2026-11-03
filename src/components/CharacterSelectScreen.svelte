<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { CHARACTERS } from "../game/characters";

  export let selectedId: string;
  export let onSelect: (id: string) => void;
  export let onBack: () => void;

  let current = CHARACTERS.find((c) => c.id === selectedId) ?? CHARACTERS[0];
  let index = CHARACTERS.indexOf(current);

  function go(delta: number) {
    index = (index + delta + CHARACTERS.length) % CHARACTERS.length;
    current = CHARACTERS[index];
  }

  function confirm() {
    onSelect(current.id);
  }
</script>

<div class="select-screen" in:fade={{ duration: 200 }}>
  <button class="back-btn" on:click={onBack} aria-label="Back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    Back
  </button>

  <h2 class="select-title">Choose Your Bird</h2>

  <div class="stage" in:scale={{ duration: 250, start: 0.85 }}>
    <button class="nav-arrow left" on:click={() => go(-1)} aria-label="Previous">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>

    <div class="bird-display" style="--body:{current.body}; --body-dark:{current.bodyDark}; --wing:{current.wing}; --wing-dark:{current.wingDark}; --beak:{current.beak}; --beak-dark:{current.beakDark};">
      {#key current.id}
        <div class="bird-card" in:scale={{ duration: 200, start: 0.7 }}>
          <div class="big-bird">
            <div class="big-bird-body">
              <div class="big-bird-wing"></div>
              <div class="big-bird-eye">
                <div class="big-bird-pupil"></div>
              </div>
              <div class="big-bird-beak"></div>
            </div>
          </div>
          <span class="char-name">{current.name}</span>
        </div>
      {/key}
    </div>

    <button class="nav-arrow right" on:click={() => go(1)} aria-label="Next">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </div>

  <div class="dots">
    {#each CHARACTERS as char, i}
      <button class="dot" class:active={i === index} on:click={() => { index = i; current = char; }} aria-label={char.name}></button>
    {/each}
  </div>

  <button class="confirm-btn" on:click={confirm}>
    Select
  </button>
</div>

<style>
  .select-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    height: 100%;
    padding: 24px 20px;
    box-sizing: border-box;
  }

  .back-btn {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 6px 14px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .select-title {
    font-size: 24px;
    color: #fff;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3), 0 3px 8px rgba(0, 0, 0, 0.4);
    font-weight: 800;
    letter-spacing: 1.5px;
    margin: 0;
  }

  .stage {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    justify-content: center;
    flex: 1;
  }

  .nav-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .nav-arrow:hover {
    background: rgba(255, 255, 255, 0.28);
    transform: scale(1.08);
  }

  .nav-arrow:active {
    transform: scale(0.92);
  }

  .bird-display {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bird-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }

  .big-bird {
    animation: float 2s ease-in-out infinite;
  }

  .big-bird-body {
    position: relative;
    width: 72px;
    height: 72px;
    background: var(--body);
    border: 4px solid var(--body-dark);
    border-radius: 50%;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  }

  .big-bird-wing {
    position: absolute;
    left: -6px;
    top: 26px;
    width: 34px;
    height: 22px;
    background: var(--wing);
    border: 2px solid var(--wing-dark);
    border-radius: 50%;
    animation: wingflap 0.4s ease-in-out infinite alternate;
  }

  .big-bird-eye {
    position: absolute;
    right: 10px;
    top: 12px;
    width: 20px;
    height: 20px;
    background: #fff;
    border: 2.5px solid #222;
    border-radius: 50%;
  }

  .big-bird-pupil {
    position: absolute;
    right: 3px;
    top: 6px;
    width: 9px;
    height: 9px;
    background: #222;
    border-radius: 50%;
  }

  .big-bird-beak {
    position: absolute;
    right: -18px;
    top: 30px;
    width: 0;
    height: 0;
    border-left: 20px solid var(--beak);
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }

  .char-name {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    letter-spacing: 0.5px;
  }

  .dots {
    display: flex;
    gap: 8px;
  }

  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dot.active {
    background: #f7d51d;
    transform: scale(1.3);
  }

  .confirm-btn {
    background: linear-gradient(180deg, #f7d51d 0%, #f29030 100%);
    border: none;
    border-radius: 12px;
    padding: 13px 48px;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(242, 144, 48, 0.45);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .confirm-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(242, 144, 48, 0.55);
  }

  .confirm-btn:active {
    transform: translateY(0) scale(0.97);
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes wingflap {
    0% { transform: translateY(0) scaleY(1); }
    100% { transform: translateY(-3px) scaleY(0.7); }
  }
</style>
