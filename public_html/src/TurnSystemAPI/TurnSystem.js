class TurnSystem {
  constructor(settings) {
    this.users = [];
    if (settings == undefined) {
      return this.defaultConstructor();
    }
    this.settings = settings;

    if (this.settings.getTurnType() === 'priority') {
      this.priorityFunction = this.settings.getCallback();
      this.conditionalFunction = null;
    }

    if (this.settings.getTurnType() === 'conditional') {
      this.conditionalFunction = this.settings.getCallback();
      this.priorityFunction = null;
    }
  }

  defaultConstructor() {
    this.settings = new Settings();
    this.turnTime = 60;
    this.priorityFunction = null;
    this.conditionalFunction = null;
    return this;
  }

  calculateNextTurn() {}

  getCurrentUser() {}

  getNextUser() {}

  getAllUsers() {}

  addUser(user) {}

  removeUser(user) {}

  setPriorityCallback() {}

  setConditionalCallback() {}

  setTurnTime() {}
}
