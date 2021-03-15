window.onload = () => {
  let myGame;
  document.onkeydown = (event) => {
        if (event.key.toLowerCase() === '5') {
      myGame = new MainTurnDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
    }
    else if (event.key.toLowerCase() === '6') {
      myGame = new AddRemovePlayerDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
    }
    else if (event.key.toLowerCase() === '7') {
      myGame = new ConditionalDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
    }
  };
  myGame = new MainTurnDemo();
  gEngine.Core.initializeEngineCore('GLCanvas', myGame);
};
