/**
 * Class PlayerActionStatus
 *
 * This class encapsulates and manages the current action states for a player.
 * It tracks motion states (directional and bouncing), teleportation, interactions
 * (with obstacles and switches), and the usage and channeling of both magic and artifacts.
 */
class PlayerCurrentActionStatus {
  /**
   * Creates an instance of PlayerActionStatus.
   * @param {Object} player - The player instance to associate with this status tracker.
   */
  constructor(player) {
    this.player = player;
    this.initializeStatusTrakers();
  }

  /**
   * Initializes all action status properties.
   *
   * Note: This method sets default values for motion states, interactions,
   * channeling phases for magic and artifacts, and environmental effects.
   */
  initializeStatusTrakers() {
    // Motion states
    this.currentlyInMotion = false;
    this.currentlyInDirectionalMotion = false; // True when the player is moving in a specific direction.
    this.currentlyInBouncingMotion = false; // True when the player is in a bouncing motion.

    // Teleportation state
    this.currentlyTeleporting = false; // True when the player is in the process of teleporting.

    // Interaction states
    this.currentlyInteractingWithObstacle = false; // True if the player is interacting with an obstacle.
    this.currentlyInteractingWithSwitch = false; // True if the player is interacting with a switch.

    // Magic channeling states
    this.currentlyChannelingMagic = false; // Indicates whether the player is channeling magic.
    this.currentMagicChannelPhase = 0; // Tracks the current phase of magic channeling.

    //specificAbilityCurrentlyBeingUsed
    this.specificAbilityCurrentlyBeingUsed = null; // The specific ability currently being used.
    this.specificArtifactCurrentlyBeingUsed = null; // The specific artifact currently being used.

    // Artifact channeling states
    this.currentlyChannelingArtifact = false; // Indicates whether the player is channeling an artifact.
    this.currentArtifactChannelPhase = 0; // Tracks the current phase of artifact channeling.

    // Ability usage states
    this.currentlyUsingMagic = false; // True when the player is actively using magic.
    this.currentlyUsingArtifact = false; // True when the player is actively using an artifact.

    // Environmental effect state
    this.currentlyAffectedByEnvironment = false; // True when the player's state is influenced by environmental factors.
  }

  /**
   * Sets the currently active ability in use.
   * Further implementation required to define what ability is selected.
   */
  setCurrentAbilityInUse(abilityName) {
    this.specificAbilityCurrentlyBeingUsed = abilityName;
    // TODO: Define logic for setting the player's active ability.
  }

  /**
   * Sets the currently active artifact in use.
   * Further implementation required to define artifact usage.
   */
  setCurrentArtifactInUse(artifactName) {
    this.specificArtifactCurrentlyBeingUsed = artifactName;
    // TODO: Define logic for setting the player's active artifact.
  }

  /**
   * Marks the ability as currently being channeled by the player.
   * Further implementation required.
   */
  setAbilityCurrentlyChanneling(abilityName) {
    this.specificAbilityCurrentlyBeingUsed = abilityName;
    // TODO: Implement logic for marking ability channeling.
  }

  /**
   * Marks the artifact as currently being channeled by the player.
   * Further implementation required.
   */
  setArtifactCurrentlyChanneling(artifactName) {
    this.specificArtifactCurrentlyBeingUsed = artifactName;
    // TODO: Implement logic for marking artifact channeling.
  }

  /**
   * Updates the current phase of magic channeling.
   * @param {number} phase - The new phase of magic channeling.
   */
  setCurrentMagicChannelPhase(phase) {
    this.currentMagicChannelPhase = phase;
  }

  /**
   * Updates the current phase of artifact channeling.
   * @param {number} phase - The new phase of artifact channeling.
   */
  setCurrentArtifactChannelPhase(phase) {
    this.currentArtifactChannelPhase = phase;
  }

  /**
   * Sets the magic channeling state.
   * @param {boolean} status - True if the player is channeling magic; otherwise false.
   */
  setChannelingMagic(status) {
    this.currentlyChannelingMagic = status;
  }

  /**
   * Sets the artifact channeling state.
   * @param {boolean} status - True if the player is channeling an artifact; otherwise false.
   */
  setChannelingArtifact(status) {
    this.currentlyChannelingArtifact = status;
  }
  /**
   * Determines if the player can act (i.e. move) based on their current action statuses.
   * All relevant state flags must be false for the player to be free to move.
   * @return {boolean} True if the player can act; otherwise false.
   */
  canAct() {
    return (
      !this.currentlyInMotion &&
      !this.currentlyInDirectionalMotion &&
      !this.currentlyInBouncingMotion &&
      !this.currentlyTeleporting &&
      !this.currentlyInteractingWithObstacle &&
      !this.currentlyInteractingWithSwitch &&
      !this.currentlyChannelingMagic &&
      !this.currentlyChannelingArtifact &&
      !this.currentlyUsingMagic &&
      !this.currentlyUsingArtifact &&
      !this.currentlyAffectedByEnvironment
    );
  }

  assembleReasonCannotMoveOrAct() {
    const reasons = [];
    if (this.currentlyInMotion) reasons.push("in basic motion");
    if (this.currentlyInDirectionalMotion)
      reasons.push("in directional motion");
    if (this.currentlyInBouncingMotion) reasons.push("in bouncing motion");
    if (this.currentlyTeleporting) reasons.push("teleporting");
    if (this.currentlyInteractingWithObstacle)
      reasons.push("interacting with an obstacle");
    if (this.currentlyInteractingWithSwitch)
      reasons.push("interacting with a switch");
    if (this.currentlyChannelingMagic) reasons.push("channeling magic");
    if (this.currentlyChannelingArtifact)
      reasons.push("channeling an artifact");
    if (this.currentlyUsingMagic) reasons.push("actively using magic");
    if (this.currentlyUsingArtifact) reasons.push("actively using an artifact");
    if (this.currentlyAffectedByEnvironment)
      reasons.push("affected by the environment");

    // Return a combined message
    return reasons.length
      ? `Movement prohibited because player is currently ${reasons.join(", ")}.`
      : "";
  }

  /**
   * Sets the magic usage state.
   * @param {boolean} status - True if the player is in the act of using magic; otherwise false.
   */
  setUsingMagic(status) {
    this.currentlyUsingMagic = status;
  }

  /**
   * Sets the artifact usage state.
   * @param {boolean} status - True if the player is in the act of using an artifact; otherwise false.
   */
  setUsingArtifact(status) {
    this.currentlyUsingArtifact = status;
  }

  /**
   * Sets the teleportation state.
   * @param {boolean} status - True if the player is teleporting; otherwise false.
   */
  setTeleporting(status) {
    this.currentlyTeleporting = status;
  }

  /**
   * Updates the interaction state for obstacles.
   * @param {boolean} status - True if the player is interacting with an obstacle; otherwise false.
   */
  setInteractingWithObstacle(status) {
    this.currentlyInteractingWithObstacle = status;
  }

  /**
   * Updates the interaction state for switches.
   * @param {boolean} status - True if the player is interacting with a switch; otherwise false.
   */
  setInteractingWithSwitch(status) {
    this.currentlyInteractingWithSwitch = status;
  }

  /**
   * Sets whether the player is affected by environmental factors.
   * @param {boolean} status - True if affected by the environment; otherwise false.
   */
  setAffectedByEnvironment(status) {
    this.currentlyAffectedByEnvironment = status;
  }

  /**
   * Updates the state for directional motion.
   * @param {boolean} status - True if the player is in directional motion; otherwise false.
   */
  setInDirectionalMotion(status) {
    this.currentlyInDirectionalMotion = status;
    this.currentlyInMotion = status;
  }

  /**
   * Updates the state for bouncing motion.
   * @param {boolean} status - True if the player is in a bouncing motion; otherwise false.
   */
  setInBouncingMotion(status) {
    this.currentlyInBouncingMotion = status;
    this.currentlyInMotion = status;
  }

  setMotionHasEnded() {
    this.currentlyInMotion = false;
    this.currentlyInDirectionalMotion = false;
    this.currentlyInBouncingMotion = false;
  }

  /**
   * Alias for setting the teleportation state, useful for contextual triggers.
   * @param {boolean} status - True if the player is teleporting; otherwise false.
   */
  setInTeleporting(status) {
    this.currentlyTeleporting = status;
  }
}
