<script lang="ts">
  export let score = 0;
  export let highScore = 0;
  export let isNewHigh = false;

  type Medal = { name: string; color: string; glow: string } | null;

  function getMedal(s: number): Medal {
    if (s >= 40) return { name: "Platinum", color: "#e5e4e2", glow: "rgba(229,228,226,0.5)" };
    if (s >= 30) return { name: "Gold", color: "#ffd700", glow: "rgba(255,215,0,0.5)" };
    if (s >= 20) return { name: "Silver", color: "#c0c0c0", glow: "rgba(192,192,192,0.4)" };
    if (s >= 10) return { name: "Bronze", color: "#cd7f32", glow: "rgba(205,127,50,0.4)" };
    return null;
  }

  const medal = getMedal(score);
</script>

<div class="game-over-card">
  <h2 class="game-over-title">Game Over</h2>

  {#if medal}
    <div class="medal-container" style="--medal-color: {medal.color}; --medal-glow: {medal.glow};">
      <div class="medal">
        <div class="medal-inner"></div>
        <div class="medal-shine"></div>
      </div>
      <span class="medal-name">{medal.name}</span>
    </div>
  {/if}

  <div class="score-row">
    <div class="score-box">
      <span class="score-label">Score</span>
      <span class="score-value">{score}</span>
    </div>
    <div class="score-divider"></div>
    <div class="score-box">
      <span class="score-label">Best</span>
      <span class="score-value">{highScore}</span>
      {#if isNewHigh}
        <span class="new-badge">NEW!</span>
      {/if}
    </div>
  </div>

  <button class="play-button">
    <span class="play-icon">▶</span>
    <span>Play Again</span>
  </button>
</div>

<style>
  .game-over-card {
    background: rgba(255, 255, 255, 0.97);
    border-radius: 20px;
    padding: 32px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.05);
    animation: cardIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .game-over-title {
    font-size: 26px;
    color: #e8861c;
    font-weight: 800;
    letter-spacing: 2px;
    margin: 0;
  }

  .medal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .medal {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--medal-color);
    box-shadow: 0 0 20px var(--medal-glow), 0 4px 12px rgba(0, 0, 0, 0.2),
      inset 0 -3px 6px rgba(0, 0, 0, 0.15), inset 0 3px 6px rgba(255, 255, 255, 0.4);
    animation: medalSpin 0.6s ease-out;
  }

  .medal-inner {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.1);
  }

  .medal-shine {
    position: absolute;
    top: 6px;
    left: 10px;
    width: 18px;
    height: 10px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: rotate(-30deg);
  }

  .medal-name {
    font-size: 13px;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .score-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .score-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    position: relative;
  }

  .score-divider {
    width: 1px;
    height: 40px;
    background: rgba(0, 0, 0, 0.08);
  }

  .score-label {
    font-size: 11px;
    color: #aaa;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .score-value {
    font-size: 30px;
    font-weight: 800;
    color: #333;
  }

  .new-badge {
    position: absolute;
    top: -2px;
    right: -42px;
    font-size: 10px;
    color: #fff;
    background: #e8861c;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
    animation: badgeBounce 0.5s ease-out 0.3s both;
  }

  .play-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(180deg, #f7d51d 0%, #f29030 100%);
    border: none;
    border-radius: 12px;
    padding: 14px 36px;
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(242, 144, 48, 0.45);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .play-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(242, 144, 48, 0.55);
  }

  .play-button:active {
    transform: translateY(0) scale(0.97);
  }

  .play-icon {
    font-size: 12px;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: scale(0.8) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes medalSpin {
    from { opacity: 0; transform: rotate(-180deg) scale(0.5); }
    to { opacity: 1; transform: rotate(0) scale(1); }
  }

  @keyframes badgeBounce {
    from { opacity: 0; transform: translateX(-10px) scale(0.5); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }
</style>
