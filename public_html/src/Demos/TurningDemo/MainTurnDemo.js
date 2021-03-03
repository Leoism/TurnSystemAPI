class MainTurnDemo {
  constructor() {
    this.turnSystem = null;
    this.settings = null;
    this.initialize();
  }

  initialize() {
    this._initSettings();
    this.turnSystem = new TurnSystem();
    this.settings = this.turnSystem.settings;
    this._initUserData();
  }

  _initSettings() {
    const settingsBuilder = new Settings.Builder();
    settingsBuilder.setTurnType('conditional');
    settingsBuilder.setCallbackFunction();
    this.settings = settingsBuilder.build();
  }

  _initUserData() {
    const user1 = new User();
    user1.setSkillSet([
      {
        move: 'Kick',
        damage: 5,
      },
      {
        move: 'Uppercut',
        damage: 20,
      },
    ]);
    const user2 = new User();
    user2.setSkillSet([
      {
        move: 'Tickle',
        damage: 2,
      },
      {
        move: 'Scream',
        damage: 1,
      },
    ]);
    this.turnSystem.addUser(user1);
    this.turnSystem.addUser(user2);
  }
}
