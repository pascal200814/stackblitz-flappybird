<script lang="ts">
  export let highScore = 0;
</script>

<div class="start-screen">
  <div class="logo-container">
    <div class="bird-icon">
      <div class="bird-body">
        <div class="bird-wing"></div>
        <div class="bird-eye">
          <div class="bird-pupil"></div>
        </div>
        <div class="bird-beak"></div>
      </div>
    </div>
    <h1 class="title">Flappy Bird</h1>
  </div>

  <div class="instructions">
    <div class="instruction-row">
      <span class="key-badge">Space</span>
      <span>or</span>
      <span class="key-badge">↑</span>
      <span class="instruction-text">to flap</span>
    </div>
    <div class="instruction-row">
      <span class="instruction-text">or simply</span>
      <span class="key-badge">Tap</span>
      <span class="instruction-text">the screen</span>
    </div>
  </div>

  {#if highScore > 0}
    <div class="best-score-pill">
      <span class="best-label">Best</span>
      <span class="best-number">{highScore}</span>
    </div>
  {/if}

  <div class="tap-prompt">
    <span class="tap-arrow">▼</span>
    <span class="tap-text">Tap to start</span>
    <span class="tap-arrow">▼</span>
  </div>
</div>

<style>
  .start-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
  }

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .bird-icon {
    animation: float 2s ease-in-out infinite;
  }

  .bird-body {
    position: relative;
    width: 48px;
    height: 48px;
    background: #f7d51d;
    border: 3px solid #c9a200;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .bird-wing {
    position: absolute;
    left: -4px;
    top: 18px;
    width: 24px;
    height: 16px;
    background: #fff;
    border: 2px solid #ddd;
    border-radius: 50%;
    animation: wingflap 0.4s ease-in-out infinite alternate;
  }

  .bird-eye {
    position: absolute;
    right: 6px;
    top: 8px;
    width: 14px;
    height: 14px;
    background: #fff;
    border: 2px solid #222;
    border-radius: 50%;
  }

  .bird-pupil {
    position: absolute;
    right: 2px;
    top: 4px;
    width: 6px;
    height: 6px;
    background: #222;
    border-radius: 50%;
  }

  .bird-beak {
    position: absolute;
    right: -12px;
    top: 20px;
    width: 0;
    height: 0;
    border-left: 14px solid #f29030;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }

  .title {
    font-size: 36px;
    color: #fff;
    text-shadow: 0 3px 0 #d9a441, 0 4px 8px rgba(0, 0, 0, 0.5);
    font-weight: 800;
    letter-spacing: 2px;
    margin: 0;
  }

  .instructions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .instruction-row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    font-weight: 500;
  }

  .key-badge {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    padding: 2px 10px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    min-width: 28px;
    text-align: center;
  }

  .instruction-text {
    opacity: 0.8;
  }

  .best-score-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 24px;
    padding: 6px 18px;
  }

  .best-label {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .best-number {
    font-size: 20px;
    font-weight: 800;
    color: #f7d51d;
  }

  .tap-prompt {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 15px;
    font-weight: 600;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .tap-arrow {
    font-size: 12px;
    opacity: 0.6;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes wingflap {
    0% { transform: translateY(0) scaleY(1); }
    100% { transform: translateY(-2px) scaleY(0.7); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
</style>
