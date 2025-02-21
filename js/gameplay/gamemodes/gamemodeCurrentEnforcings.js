class GamemodeCurrentEnforcings {
  constructor() {
    this.initializeCurrentEnforcings();
  }

  initializeCurrentEnforcings() {
    this.movementIsProhibited = false;
    this.magicIsProhibited = false;
    this.artifactIsProhibited = false;
    this.interactionIsProhibited = false;
    this.teleportationIsProhibited = false;
    this.channelingIsProhibited = false;
  }
}
