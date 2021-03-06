/**
 * TurnSystem Class
 *
 * Manages n amount of users within a game and determines the next turn.
 */
class TurnSystem {
  /**
   * Constructs a TurnSystem class with the provided settings, if any. If no
   * settings object is specified,it creates a default settings object.
   * @param {Settings} settings - (Optional) a settings object to configure the
   *                              turn system.
   */
  constructor(settings) {
    this.users = [];
    if (settings == undefined) {
      return this._defaultConstructor();
    }
    this.settings = settings;

    if (
      this.settings.getTurnType() === 'priority' ||
      this.settings.getTurnType() === 'conditional'
    ) {
      this.callbackFunction = this.settings.getCallback();
    }
    if (this.settings.getTurnType() === 'timed') {
      this.timeTicker = 0;
      this.maxTime = this.settings.getTurnTime() * 60;
    }
  }

  update() {}

  /**
   * Default construct the initializes the TurnSystem class with default settings.
   */
  _defaultConstructor() {
    this.settings = new Settings();
    this.callbackFunction = null;
    this.timeTicker = 0;
    return this;
  }

  /**
   * TODO: implement the logic
   */
  calculateNextTurn() {
    const turnType = this.settings.getTurnType();
    if (turnType === 'priority') {
      this.callbackFunction(users);
      console.log(`New order of turns: ${users}`);
    }

    if (turnType === 'conditional') {
      const isMet = this.callbackFunction(this.getCurrentUser());
      console.log(`Is condition met: ${isMet}`);
    }

    if (turnType === 'timed') {
      this.timeTicker++;
      /** assume 60 update calls per second */
      if (this.timeTicker === this.maxTime) {
        const action = {
          user: this.getCurrentUser(),
          action: this.getCurrentUser().action(),
        };
        this.getCurrentUser().isActive = false;
        this.users.push(this.users.shift());
        this.getCurrentUser().isActive = true;
        this.timeTicker = 0;
        return action;
      }
    }
  }

  /**
   * Maxes out the time ticker to one update before the max.
   */
  maxOutTimeTicker() {
    console.log('hu');
    this.timeTicker = this.maxTime - 1;
  }

  get remainingTime() {
    return Math.ceil((this.maxTime - this.timeTicker) / 60);
  }

  /**
   * Returns the current user object.
   */
  getCurrentUser() {
    return this.users[0];
  }

  /**
   * Returns the user that immediately succeeds the current user.
   */
  getNextUser() {
    return this.users[1];
  }

  /**
   * Returns the list of all users.
   */
  getAllUsers() {
    return this.users;
  }

  /**
   * Returns true if the user passed in is successfully added. Otherwise, returns false.
   * @param {Object} user - a user object to be addd to the current list.
   */
  addUser(user) {
    if (this.users.length >= this.settings.getMaxUsers()) {
      console.error(
        `Max supported user limit of ${this.settings.getMaxUsers()} reached.`
      );
      return false;
    }

    const userIdx = this._findUserIndex(user);
    if (userIdx >= 0) {
      console.error(`User is already inside the collection.`);
      return false;
    }

    this.users.push(user);
    return true;
  }

  /**
   * Returns true if the user passed in is successfully removed. Otherwise,
   * returns false.
   * @param {Object} user - the user object to be removed from the current list.
   */
  removeUser(user) {
    const userIdx = this._findUserIndex(user);
    if (userIdx < 0) {
      console.error(`User not found inside the collection.`);
      return false;
    }

    this.users.splice(userIdx, 1);
    return true;
  }

  /**
   * Traverses the current list of users and returns the index of the user
   * object. If no user is found, return -1;
   * @param {Object} user - the user object to search for.
   */
  _findUserIndex(user) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === user) return i;
    }
    return -1;
  }
}
