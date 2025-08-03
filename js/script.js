document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('start-button');
  if (startButton) {
    startButton.addEventListener('click', startGame);
  }

  const swingButton = document.getElementById('swing-button');
  if (swingButton) {
    swingButton.addEventListener('click', handleSwing);
  }

  const joinButton = document.querySelector('.cta-buttons button:nth-child(1)');
  const storeButton = document.querySelector('.cta-buttons button:nth-child(2)');

  if (joinButton) {
    joinButton.addEventListener('click', () => {
      const newWin = window.open('https://www.bogeyhound.com', '_blank');
      if (newWin) newWin.opener = null;
    });
  }

  if (storeButton) {
    storeButton.addEventListener('click', () => {
      const newWin = window.open('https://www.bogeyhound.com', '_blank');
      if (newWin) newWin.opener = null;
    });
  }
});

function startGame() {
  console.log("Game started");
}

function handleSwing() {
  console.log("Swing handled");
}
