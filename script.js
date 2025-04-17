// Timer settings in milliseconds
const settings = {
    smallCamp: { activateTime: 2 * 60 * 1000, pulseInterval: null },
    mediumCamp: { activateTime: 6 * 60 * 1000, pulseInterval: null },
    largeCamp: { activateTime: 8 * 60 * 1000, pulseInterval: null },
    vault: { activateTime: 8 * 60 * 1000, pulseInterval: null },
    soulUrn: { activateTime: 10 * 60 * 1000, pulseInterval: 5 * 60 * 1000 },
    powerup: { activateTime: 10 * 60 * 1000, pulseInterval: 5 * 60 * 1000 },
    midBoss: { activateTime: 10 * 60 * 1000, pulseInterval: null }
  };

  let midBossRestarts = 0;

  const timerDisplay = document.getElementById('timer');
  const restartBtn = document.getElementById('restartBtn');
  const timerDecreaseBtn = document.getElementById('timer-decrease');
  const timerIncreaseBtn = document.getElementById('timer-increase');

  let startTime;
  let timerInterval;
  let audioArray = [];

  // Format time as MM:SS
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function formatCountdown(ms) {
    if (ms <= 0) return 'ACTIVE';
    return formatTime(ms);
  }

  function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
    
    Object.keys(settings).forEach(blockId => {
      const block = document.getElementById(blockId);
      const blockTimer = document.getElementById(`${blockId}Timer`);
      const activateTime = settings[blockId].activateTime;
      
      const timeRemaining = activateTime - elapsedTime;
      
      if (timeRemaining <= 0 && (!block.classList.contains('active') || settings[blockId].pulseInterval)) {
        pulseBlock(blockId);
        block.classList.add('active');

        if (settings[blockId].pulseInterval)
          settings[blockId].activateTime += settings[blockId].pulseInterval;
      }
      
      blockTimer.textContent = formatCountdown(timeRemaining);
    });

    if (audioArray.length > 0) {
      const audio = audioArray.shift();
      audio.play();
    }
  }

  function pulseBlock(blockId) {
    const block = document.getElementById(blockId);
    const audio = new Audio(`audio/${blockId}.mp3`);
    audioArray.push(audio);

    block.classList.add('pulse');
    setTimeout(() => {
      block.classList.remove('pulse');
    }, 5000);
  }

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function timerDecrease() {
    startTime += 5000;
    updateTimer();
  }

  function timerIncrease() {
    startTime -= 5000;
    updateTimer();
  }

  function restartMidBoss() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const midBoss = document.getElementById('midBoss');
    
    midBoss.classList.remove('active');
    settings.midBoss.activateTime = elapsedTime + (7 - midBossRestarts) * 60 * 1000;
    
    if (midBossRestarts < 2)
      midBossRestarts++;
  }

  timerDecreaseBtn.addEventListener('click', timerDecrease);
  timerIncreaseBtn.addEventListener('click', timerIncrease);
  restartBtn.addEventListener('click', restartMidBoss);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      timerDecrease();
    } else if (e.key === 'ArrowRight') {
      timerIncrease();
    } else if (e.key === 'ArrowDown') {
      restartMidBoss();
    }
  });

  document.addEventListener('DOMContentLoaded', startTimer);
  
  // If DOMContentLoaded already fired, start timer immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startTimer();
  }