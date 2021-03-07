window.onload = () => {
  let myGame;
  let gamePick = true;
  document.onkeydown = (event) => {
    // TODO: Fix errors
    if (event.key.toLowerCase() === 'p') {
      myGame = gamePick ? new MainTurnDemo() : new AddRemovePlayerDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
      gamePick = !gamePick;
    }
  };
  myGame = new MainTurnDemo();
  gEngine.Core.initializeEngineCore('GLCanvas', myGame);
};
