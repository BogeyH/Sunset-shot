
let gameState = {
  shot1: '',
  shot2: '',
  putt: '',
  finalScore: 4,
  vibeTitle: ''
};

const canvas = document.getElementById('arcCanvas');
const ctx = canvas.getContext('2d');

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('bg-music').play();
  showScene('tee');
});

function showScene(scene) {
  const sceneEl = document.getElementById('scene');
  const choicesEl = document.getElementById('choices');
  const commentaryEl = document.getElementById('commentary');
  canvas.style.display = 'none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  choicesEl.innerHTML = '';
  commentaryEl.innerText = '';

  if (scene === 'tee') {
    sceneEl.innerText = COPY.intro_text;
    choicesEl.innerHTML = `
      <button onclick="takeShot('driver')">${COPY.driver}</button>
      <button onclick="takeShot('3wood')">${COPY['3wood']}</button>
    `;
  } else if (scene === 'approach') {
    sceneEl.innerText = COPY.approach_text;
    choicesEl.innerHTML = `
      <button onclick="takeApproach('iron')">${COPY.iron}</button>
      <button onclick="takeApproach('wedge')">${COPY.wedge}</button>
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

function animateArc(callback) {
  canvas.style.display = 'block';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let t = 0;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const x = t * canvas.width;
    const y = -Math.pow(t - 0.5, 2) * 300 + 150;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#D43D3D';
    ctx.fill();
    t += 0.01;
    if (t <= 1) {
      requestAnimationFrame(draw);
    } else {
      canvas.style.display = 'none';
      callback();
    }
  };
  draw();
}

function takeShot(club) {
  gameState.shot1 = club;
  if (club === 'driver') {
    gameState.finalScore += 1;
    gameState.vibeTitle = 'lumberjack';
  } else {
    gameState.vibeTitle = 'sundowner';
  }
  animateArc(() => {
    document.getElementById('commentary').innerText = COPY[club + '_result'];
    setTimeout(() => showScene('approach'), 1500);
  });
}

function takeApproach(club) {
  gameState.shot2 = club;
  if (club === 'wedge') {
    gameState.finalScore += 1;
    if (gameState.vibeTitle === '') gameState.vibeTitle = 'beach_bum';
  }
  animateArc(() => {
    document.getElementById('commentary').innerText = COPY[club + '_result'];
    setTimeout(() => showScene('putt'), 1500);
  });
}

function takePutt(power) {
  gameState.putt = power;
  if (power === 'firm') {
    gameState.finalScore += 1;
  }
  document.getElementById('commentary').innerText = COPY[power + '_result'];
  setTimeout(() => showScene('finish'), 2000);
}

function showFinalScore() {
  const sceneEl = document.getElementById('scene');
  const choicesEl = document.getElementById('choices');
  const commentaryEl = document.getElementById('commentary');
  const score = gameState.finalScore;
  const vibe = gameState.vibeTitle || 'sundowner';

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
    <button onclick="window.location.href='https://bogeyhound.com?utm_source=sunsetround&utm_campaign=vibe'">
      ${COPY.shop}
    </button>
    <button onclick="window.location.href='https://bogeyhound.com/join?utm_source=sunsetround&utm_campaign=vibe'">
      ${COPY.join}
    </button>
  `;
  commentaryEl.innerText = '';
}
