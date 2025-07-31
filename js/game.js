
window.onload = () => {
  let gameState = {
    shots: [],
    currentClub: '',
    score: 0,
    vibeStats: {
      treesHit: 0,
      fairwaysHit: 0,
      sandShots: 0,
      consistentShots: 0
    }
  };

  const canvas = document.getElementById('arcCanvas');
  const ctx = canvas.getContext('2d');

  const sceneEl = document.getElementById('scene');
  const choicesEl = document.getElementById('choices');
  const commentaryEl = document.getElementById('commentary');
  const startBtn = document.getElementById('start-btn');

  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    document.getElementById('bg-music').play();
    showScene('tee');
  });

  function typeCommentary(text, callback) {
    commentaryEl.innerText = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        commentaryEl.innerText += text.charAt(i);
        i++;
        setTimeout(type, 30);
      } else if (callback) {
        setTimeout(callback, 1000);
      }
    }
    type();
  }

  function showScene(scene) {
    canvas.style.display = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    choicesEl.innerHTML = '';
    commentaryEl.innerText = '';

    if (scene === 'tee') {
      sceneEl.innerText = COPY.intro_text;
      choicesEl.innerHTML = `
        <button onclick="startSwing('driver')">${COPY.driver}</button>
        <button onclick="startSwing('3wood')">${COPY['3wood']}</button>
      `;
    } else if (scene === 'approach') {
      sceneEl.innerText = COPY.approach_text;
      choicesEl.innerHTML = `
        <button onclick="startSwing('iron')">${COPY.iron}</button>
        <button onclick="startSwing('wedge')">${COPY.wedge}</button>
      `;
    } else if (scene === 'putt') {
      sceneEl.innerText = COPY.putt_text;
      choicesEl.innerHTML = `
        <button onclick="takePutt('soft')">${COPY.soft}</button>
        <button onclick="takePutt('firm')">${COPY.firm}</button>
      `;
    } else if (scene === 'finish') {
      showFinalScore();
    }
  }

  function startSwing(club) {
    gameState.currentClub = club;
    sceneEl.innerText = "Set your angle...";
    let phase = 'angle';
    let meter = 0;
    let dir = 1;
    let angle = 0;
    let power = 0;

    const meterDisplay = document.createElement('div');
    meterDisplay.style.margin = "10px";
    meterDisplay.style.fontSize = "20px";
    meterDisplay.style.fontFamily = "monospace";
    meterDisplay.id = "meter-display";
    gameContainer.appendChild(meterDisplay);

    const interval = setInterval(() => {
      meter += dir * 2;
      if (meter >= 100 || meter <= 0) dir *= -1;
      meterDisplay.innerText = `[ ${"#".repeat(meter / 10)}${" ".repeat(10 - meter / 10)} ]`;
    }, 30);

    const stopBtn = document.createElement('button');
    stopBtn.textContent = "Stop";
    stopBtn.onclick = () => {
      if (phase === 'angle') {
        angle = meter - 50;
        phase = 'power';
        meter = 0;
        dir = 1;
        sceneEl.innerText = "Set your power...";
      } else {
        power = meter / 100;
        clearInterval(interval);
        stopBtn.remove();
        meterDisplay.remove();
        takeShot(club, angle, power);
      }
    };

    choicesEl.innerHTML = '';
    choicesEl.appendChild(stopBtn);
  }

  function takeShot(club, angle, power) {
    gameState.score++;
    gameState.shots.push({ club, angle, power });

    canvas.style.display = 'block';
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rad = (angle * Math.PI) / 180;
      const x = t * canvas.width;
      const y = -Math.pow(t - 0.5, 2) * (300 * power) + 150;
      const finalX = x + Math.sin(rad) * 50;
      ctx.beginPath();
      ctx.arc(finalX, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#D43D3D';
      ctx.fill();
      t += 0.005;
      if (t <= 1) {
        requestAnimationFrame(draw);
      } else {
        canvas.style.display = 'none';
        let comment = getCommentary(club, angle, power);
        typeCommentary(comment, () => {
          if (gameState.shots.length === 1) showScene('approach');
          else if (gameState.shots.length === 2) showScene('putt');
        });
      }
    };
    draw();
  }

  function getCommentary(club, angle, power) {
    if (Math.abs(angle) > 30) {
      gameState.vibeStats.treesHit++;
      return "Took the scenic route—hope there's a gap!";
    }
    if (club === 'wedge' && power < 0.5) {
      gameState.vibeStats.sandShots++;
      return "Crafty wedge work. Low and lovely.";
    }
    if (Math.abs(angle) < 10 && power > 0.6) {
      gameState.vibeStats.consistentShots++;
      return "Right down the pipe. That's smooth.";
    }
    return "Well struck. Could be in good shape.";
  }

  function takePutt(powerType) {
    gameState.score++;
    if (powerType === 'firm') {
      typeCommentary(COPY.firm_result, () => showScene('finish'));
    } else {
      typeCommentary(COPY.soft_result, () => showScene('finish'));
    }
  }

  function determineVibe() {
    const stats = gameState.vibeStats;
    if (stats.treesHit >= 2) return 'lumberjack';
    if (stats.sandShots >= 1) return 'beach_bum';
    if (stats.consistentShots >= 2) return 'sundowner';
    return 'sundowner';
  }

  function showFinalScore() {
    const score = gameState.score;
    const vibe = determineVibe();
    let scoreComment = '';
    if (score <= 4) {
      scoreComment = COPY.score_4_or_less.replace('{score}', score);
    } else if (score === 5) {
      scoreComment = COPY.score_5.replace('{score}', score);
    } else {
      scoreComment = COPY.score_above_5.replace('{score}', score);
    }

    sceneEl.innerHTML = `
      <h2>${scoreComment}</h2>
      <h3>Your vibe: ${COPY[vibe]}</h3>
    `;
    choicesEl.innerHTML = `
      <button onclick="location.reload()">Play Again</button>
      <button onclick="window.location.href='https://bogeyhound.com?utm_source=sunsetround&utm_campaign=vibe'">${COPY.shop}</button>
      <button onclick="window.location.href='https://bogeyhound.com/join?utm_source=sunsetround&utm_campaign=vibe'">${COPY.join}</button>
    `;
    commentaryEl.innerText = '';
  }
};
