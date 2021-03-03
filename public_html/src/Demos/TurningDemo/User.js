class User {
  constructor() {
    this.name = '';
    this.skillSet = [{ move: 'Punch', damage: 10 }];
    this.health = 100;
  }

  /**
   * Adds a move to the users skill set
   * @param {Object} moveData - object with move and damage key value pairs
   */
  addMove(moveData) {
    if (this.skillSet.length >= 4) {
      return;
    }

    this.skillSet.push(moveData);
  }

  /**
   * Sets the skill set for the user. Cannot exceed 4 moves. If more than 4
   * moves, only the first four are used.
   * @param {Array} skillsArr - array with move data information.
   */
  setSkillSet(skillsArr) {
    const editArr = [...skillsArr];
    if (skillsArr.length > 4) {
      editArr.slice(0, 4);
    }
    this.skillSet = editArr;
  }

  /**
   * Sets the users name.
   * @param {String} name - the name to identify the user.
   */
  setUserName(name) {
    this.name = name;
  }

  setHealth(hp) {
    if (hp <= 0) return;
    this.health = hp;
  }

  decreaseHealth(amt) {
    this.health -= amt;
    this.health = this.health <= 0 ? 0 : this.health;
    this._checkHealth();
  }

  _checkHealth() {
    if (this.health < 0) {
      return 'dead';
    }
    return 'alive';
  }
}
