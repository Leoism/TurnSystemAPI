window.onload = () => {
  let myGame;
  document.onkeydown = (event) => {
        if (event.key.toLowerCase() === '1') {
      myGame = new MainTurnDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
    }
    else if (event.key.toLowerCase() === '2') {
      myGame = new AddRemovePlayerDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
    }
    else if (event.key.toLowerCase() === '3') {
      myGame = new ConditionalDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
    }
  };
  myGame = new MainTurnDemo();
  gEngine.Core.initializeEngineCore('GLCanvas', myGame);
};
