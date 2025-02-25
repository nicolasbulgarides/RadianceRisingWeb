class GamemodeEnforcings {
  constructor() {
    this.initializeEnforcings();
  }

  initializeEnforcings() {
    this.movementIsProhibited = false;
    this.magicIsProhibited = false;
    this.artifactIsProhibited = false;
    this.interactionIsProhibited = false;
    this.teleportationIsProhibited = false;
    this.channelingIsProhibited = false;
    this.maximumMovementDistance = 1;
  }

  setMaximumMovementDistance(newMaximumMovementDistance) {
    this.maximumMovementDistance = newMaximumMovementDistance;
  }

  setMovementIsProhibited(newMovementIsProhibited) {
    this.movementIsProhibited = newMovementIsProhibited;
  }

  setMagicIsProhibited(newMagicIsProhibited) {
    this.magicIsProhibited = newMagicIsProhibited;
  }

  setArtifactIsProhibited(newArtifactIsProhibited) {
    this.artifactIsProhibited = newArtifactIsProhibited;
  }

  setInteractionIsProhibited(newInteractionIsProhibited) {
    this.interactionIsProhibited = newInteractionIsProhibited;
  }

  setTeleportationIsProhibited(newTeleportationIsProhibited) {
    this.teleportationIsProhibited = newTeleportationIsProhibited;
  }

  setChannelingIsProhibited(newChannelingIsProhibited) {
    this.channelingIsProhibited = newChannelingIsProhibited;
  }
}
