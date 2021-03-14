let myGame;
window.onload = () => {
  let gamePick = false;
  document.onkeydown = (event) => {
    if (event.key?.toLowerCase() === '/') {
      myGame = gamePick ? new MainTurnDemo() : new AddRemovePlayerDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
      gamePick = !gamePick;
    }
  };
  myGame = new PriorityDemo();
  document.getElementById('priority-controls').style.display = 'inline';
  gEngine.Core.initializeEngineCore('GLCanvas', myGame);
};

function submitPlayer(event) {
  if (event.key?.toLowerCase() !== 'enter') return;
  const input = document.getElementById('player-submission');
  if (input.value <= 0) return;
  if (myGame.constructor.name !== 'PriorityDemo') return;
  const color = document.getElementById('color-submission');
  if (!color) return;

  myGame.addNewPlayer(
    input.value,
    [...hexToRGB(color.value), 255].map((v) => v / 255)
  );

  // set the order for the player drawings.
  input.value = '';
  myGame._displayPlayerOrder();
}

function removePlayer() {
  if (myGame.constructor.name !== 'PriorityDemo') return;
  myGame.removeLastPlayer();
  myGame._displayPlayerOrder();
}

// sourced from https://stackoverflow.com/a/39077686
function hexToRGB(hex) {
  return hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
}
