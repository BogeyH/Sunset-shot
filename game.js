
let gameState = {
  shot1: '',
  shot2: '',
  putt: '',
  finalScore: 4,
  vibeTitle: ''
};

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 200;
canvas.style.display = 'none';
canvas.id = 'arcCanvas';
document.body.appendChild(canvas);
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
    sceneEl.innerText = "The last hole of the day. The sun's down. The vibes are up. Let’s walk it in.";
    choicesEl.innerHTML = `
      <button onclick="takeShot('driver')">The Big Dog (Driver)</button>
      <button onclick="takeShot('3wood')">The Fairway Finder (3-Wood)</button>
    `;
  } else if (scene === 'approach') {
    sceneEl.innerText = "You’re in range now. Let’s get it on the dance floor.";
    choicesEl.innerHTML = `
      <button onclick="takeApproach('iron')">The Approach Pro (Iron)</button>
      <button onclick="takeApproach('wedge')">The Escape Artist (Wedge)</button>
    `;
  } else if (scene === 'putt') {
    sceneEl.innerText = "Just you and the cup.";
    choicesEl.innerHTML = `
      <button onclick="takePutt('soft')">Play it safe</button>
      <button onclick="takePutt('firm')">Give it a run</button>
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
  const commentaryEl = document.getElementById('commentary');
  if (club === 'driver') {
    gameState.finalScore += 1;
    gameState.vibeTitle = 'The Lumberjack';
  } else {
    gameState.vibeTitle = 'The Sundowner';
  }
  animateArc(() => {
    commentaryEl.innerText = (club === 'driver') ? "Boom. Might be in the trees, but you let it fly." : "Smooth swing. Right down the middle.";
    setTimeout(() => showScene('approach'), 1500);
  });
}

function takeApproach(club) {
  gameState.shot2 = club;
  const commentaryEl = document.getElementById('commentary');
  if (club === 'wedge') {
    gameState.finalScore += 1;
    if (gameState.vibeTitle === '') gameState.vibeTitle = 'The Beach Bum';
  }
  animateArc(() => {
    commentaryEl.innerText = (club === 'wedge') ? "That’s one way to get there." : "Landed soft. You’re putting.";
    setTimeout(() => showScene('putt'), 1500);
  });
}

function takePutt(power) {
  gameState.putt = power;
  const commentaryEl = document.getElementById('commentary');
  if (power === 'firm') {
    gameState.finalScore += 1;
  }
  commentaryEl.innerText = (power === 'firm') ? "Just missed, but a solid tap-in." : "Drip... drip... in.";
  setTimeout(() => showScene('finish'), 2000);
}

function showFinalScore() {
  const sceneEl = document.getElementById('scene');
  const choicesEl = document.getElementById('choices');
  const commentaryEl = document.getElementById('commentary');
  const score = gameState.finalScore;
  const vibe = gameState.vibeTitle || 'The Sundowner';

  let scoreComment = '';
  if (score <= 4) {
    scoreComment = `A strong ${score}! That calls for a round at the 19th.`;
  } else if (score === 5) {
    scoreComment = `You walked away with a ${score}. A bogey never looked so good.`;
  } else {
    scoreComment = `That’s a ${score}. More time to enjoy the walk. We call that a win.`;
  }

  sceneEl.innerHTML = `
    <h2>${scoreComment}</h2>
    <h3>Your vibe: ${vibe}</h3>
  `;
  choicesEl.innerHTML = `
    <button onclick="window.location.href='https://bogeyhound.com?utm_source=sunsetround&utm_campaign=vibe'">
      Shop the Sunset Drop
    </button>
    <button onclick="window.location.href='https://bogeyhound.com/join?utm_source=sunsetround&utm_campaign=vibe'">
      Join the Pack
    </button>
  `;
  commentaryEl.innerText = '';
}
