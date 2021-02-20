class Settings {
  constructor(builder) {
    // when no parameters are passed in aka default constructor
    if (builder == undefined) {
      return new Settings.Builder().build();
    }

    this.turnType = builder.turnType;
    this.maxUsers = builder.maxUsers;
  }

  getTurnType() {
    return this.turnType;
  }

  getMaxUsers() {
    return this.maxUsers;
  }
}

Settings.Builder = class {
  constructor() {
    this.turnType = 'timed';
    this.maxUsers = 2;
  }

  setTurnType(type) {
    if (!type instanceof String) {
      console.error(`${type} is not a string. It is a ${typeof type}.`);
      return;
    }

    const lcType = type.toLowerCase();
    if (lcType === 'timed' || lcType === 'priority' || lcType === 'conditional')
      this.turnType = lcType;
    else
      console.error(
        'InvalidTypeError: String passed in is not of value "timed," "priority," or "conditional."'
      );
    return this;
  }

  setMaxUsers(max) {
    if (!max instanceof Number) {
      console.error(`Value passed in must be a number. Not ${typeof max}.`);
      return;
    }

    if (max <= 0) {
      console.error('Minimum number of users must be 1.');
      return;
    }

    this.maxUsers = max;
    return this;
  }

  build() {
    return new Settings(this);
  }
};
