/**
 * LightingFrameUpdates Class
 *
 * Handles per-frame updates that drive dynamic lighting effects.
 * Updates include changes in light intensity, hue, and position using time-based
 * sine wave calculations and phase offsets. Also manages frame counters to avoid
 * potential overflow issues during prolonged gameplay.
 */
class LightingFrameUpdates {
  static LOGGING_ENABLED = true;
  constructor(lightingManager) {
    this.lightingManager = lightingManager;
    this.lightFrameIndex = 0;
  }

  /**
   * Placeholder for updating a light's position.
   */
  possiblyUpdateLightPosition() {}

  /**
   * Updates a light's intensity based on its color shift profile and elapsed time.
   *
   * @param {number} currentTime - Timestamp in milliseconds.
   * @param {LightingObject} lightObject - The light to update.
   */
  possiblyUpdateLightIntensity(currentTime, lightObject) {
    if (!lightObject.lightIntensityShiftPaused && lightObject.light != null) {
      let lightShift = lightObject.colorShiftProfile;
      let timeReversalFactor = this.getReversalSwitch(
        lightObject.lightIntensityShiftInReverse
      );

      let updatedLightIntensity =
        timeReversalFactor * lightShift.baseLightIntensity +
        lightShift.baseLightIntensityAmplitude *
          Math.sin(
            currentTime * lightShift.baseLightIntensitySpeed +
              lightShift.lightIntensityPhaseRatio
          );

      lightObject.light.intensity = updatedLightIntensity;

      if (
        updatedLightIntensity >=
          lightShift.baseLightIntensity +
            lightShift.baseLightIntensityAmplitude ||
        updatedLightIntensity <=
          lightShift.baseLightIntensity - lightShift.baseLightIntensityAmplitude
      ) {
        lightObject.toggleLightIntensityDirection();
      }
    }
  }

  /**
   * Updates a light's hue based on its color shift profile and elapsed time.
   *
   * @param {number} currentTime - Timestamp in milliseconds.
   * @param {LightingObject} lightObject - The light to update.
   */
  possiblyUpdateLightHue(currentTime, lightObject) {
    let lightColorShift = lightObject.colorShiftProfile;

    if (!lightColorShift.colorShiftPaused) {
      let directionModifier = this.getReversalSwitch(
        lightObject.colorShiftInReverse
      );
      let timeModified = currentTime * directionModifier;

      if (lightColorShift.baseHue >= 0) {
        let light = lightObject.light;
        let newHue =
          lightColorShift.baseHue +
          lightColorShift.hueVariation *
            Math.sin(timeModified * lightColorShift.hueShiftSpeed);
        light.diffuse =
          this.lightingManager.lightingFactory.lightingPropertyCalculator.hsvToRgb(
            newHue,
            1,
            1
          );

        if (
          newHue >= lightColorShift.baseHue + lightColorShift.hueVariation ||
          newHue <= lightColorShift.baseHue - lightColorShift.hueVariation
        ) {
          lightObject.toggleColorShiftDirection();
        }
      }
    }
  }

  /**
   * Increments the frame counter and returns the elapsed time in seconds.
   * Resets the frame counter when it nears integer overflow.
   *
   * @returns {number} Elapsed time in seconds.
   */
  updateLightTimeAndFrame() {
    this.lightFrameIndex++;
    if (this.lightFrameIndex >= 155520000) {
      this.lightFrameIndex = 0;
    }
    const elapsedTime = performance.now() * 0.001;
    return elapsedTime;
  }

  /**
   * Updates a light's hue, intensity, and position based on current time.
   *
   * @param {number} currentTime - Timestamp in milliseconds.
   * @param {LightingObject} lightObject - The light to update.
   */
  initializeValuesByPhase(currentTime, lightObject) {
    this.possiblyUpdateLightHue(currentTime, lightObject);
    this.possiblyUpdateLightIntensity(currentTime, lightObject);
    this.possiblyUpdateLightPosition(currentTime, lightObject);
  }

  /**
   * Processes frame update for player-model-based lighting adjustments.
   *
   * @param {Object} playerModel - The player model.
   * @param {BABYLON.Light} chasingLight - Light following the player.
   * @param {Object} playerPositionedObject - Object containing player position data.
   */
  processFrameOnPlayerModel(playerModel, chasingLight, playerPositionedObject) {
    if (
      playerModel != null &&
      chasingLight != null &&
      playerPositionedObject != null
    ) {
      let copyMe = playerPositionedObject.getCompositePositionBaseline();
      let positionVector = new BABYLON.Vector3(copyMe.x, copyMe.y, copyMe.z);
      chasingLight.position = positionVector;
    } else {
      this.intelligentLogForPlayerLightMovement(
        playerModel,
        chasingLight,
        playerPositionedObject
      );
    }
  }

  /**
   * Iterates through all active lights and applies per-frame updates.
   *
   * @param {Array<LightingObject>} activeLightObjects - Array of lights.
   */
  processFrameOnActiveLightObjects(activeLightObjects) {
    let currentTime = this.updateLightTimeAndFrame();
    activeLightObjects.forEach((lightObject) => {
      this.possiblyUpdateLightHue(currentTime, lightObject);
      this.possiblyUpdateLightIntensity(currentTime, lightObject);
      this.possiblyUpdateLightPosition(currentTime, lightObject);
    });
  }

  /**
   * Logs a warning if components for player light movement are missing.
   *
   * @param {Object} playerModel
   * @param {BABYLON.Light} chasingLight
   * @param {Object} playerPositionedObject
   */
  intelligentLogForPlayerLightMovement(
    playerModel,
    chasingLight,
    playerPositionedObject
  ) {
    if (playerModel == null) {
      ChadUtilities.SmartLogger(
        LightingManager.lightingLoggingEnabled,
        "Player model null - Lighting frame updates!",
        "LightingFrameUpdates-A"
      );
    }
    if (chasingLight == null) {
      ChadUtilities.SmartLogger(
        LightingManager.lightingLoggingEnabled,
        "Player chasing light null - Lighting frame updates!",
        "LightingFrameUpdates-B"
      );
    }
    if (playerPositionedObject == null) {
      ChadUtilities.SmartLogger(
        LightingManager.lightingLoggingEnabled,
        "Player positioend object null - lighting frame updates!",
        "LightingFrameUpdates-C"
      );
    }
  }

  /**
   * Updates the light's position based on its motion profile.
   * Supports multiple motion types (linear, orbital, eccentric).
   *
   * @param {number} currentTime - Current timestamp.
   * @param {LightingObject} lightObject - The light to update.
   */
  updateLightPosition(currentTime, lightObject) {
    if (lightObject.motionProfile != null) {
      let motionProfile = lightObject.motionProfile;
      if (!this.checkIfNotInMotion(motionProfile.pathCategory)) {
        let pathCategory = motionProfile.pathCategory;

        if (pathCategory === "linear") {
          this.processLinearMotion(currentTime, lightObject, motionProfile);
        } else if (pathCategory === "orbital") {
          this.processOrbitalMotion(currentTime, lightObject, motionProfile);
        } else if (pathCategory == "eccentric") {
          this.processEccentricMotion(currentTime, lightObject, motionProfile);
        }
      }
    } else {
      ChadUtilities.SmartLogger(
        this.LOGGING_ENABLED,
        "Light object's motion profile was null!",
        "LightingFrameUpdates-D"
      );
    }
  }

  // The following methods (processLinearMotion, processEccentricMotion, processOrbitalMotion)
  // contain similar inline comments documenting what happens within each motion type.

  //to do - code linear motion for lights formula
  processLinearMotion(currentTime, lightObject, motionProfile) {
    if (motionProfile.pathCategory === "linear" && lightObject.light) {
      let light = lightObject.light;

      /** 
      let adjustedDirection = this.getReversalSwitch(lightObject.motionInReverse);
      // Speed per second
      let speed = * motionInReverse motionProfile.speed; // units per second

      // Compute movement vector (normalized direction * speed * time)
      let moveVector = motionProfile.direction.scale(speed * currentTime);

      // Update position
      light.position.addInPlace(moveVector);
      */
    }
  }

  processEccentricMotion(currentTime, lightObject, motionProfile) {
    if (motionProfile.pathCategory === "eccentric") {
    }
  }
  processOrbitalMotion(currentTime, lightObject, motionProfile) {
    if (motionProfile.pathCategory === "orbital") {
      let light = lightObject.light;

      // Direction modifier (handles reverse orbit)
      let possibleReversal = this.getReversalSwitch(lightObject.isInReverse);
      let orbitSpeed = motionProfile.baseSpeed; // Speed is scalar, not an object
      let orbitCenter = motionProfile.basePosition;
      let orbitRadius = motionProfile.radiusOrDistance;

      let adjustedTime = currentTime * possibleReversal;

      // Convert phase ratio (0 to 1) into radians (0 to 2π)
      let phaseX = motionProfile.startMotionRatio.x * 2 * Math.PI;
      let phaseY = motionProfile.startMotionRatio.y * 2 * Math.PI;
      let phaseZ = motionProfile.startMotionRatio.z * 2 * Math.PI;

      // Calculate new positions using sine and cosine
      const angleX = adjustedTime * orbitSpeed.x + phaseX;
      const x = orbitCenter.x + orbitRadius.x * Math.cos(angleX);

      const angleY = adjustedTime * orbitSpeed.y + phaseY;
      const y = orbitCenter.y + orbitRadius.y * Math.sin(angleY);

      const angleZ = adjustedTime * orbitSpeed.z + phaseZ;
      const z = orbitCenter.z + orbitRadius.z * Math.cos(angleZ);

      // Update the light's position
      light.position = new BABYLON.Vector3(x, y, z);
    }
  }

  // TO DO
  getPlaceholderMotionFillerArray() {
    let placeholders = [
      "null",
      "basic",
      "test",
      "placeholder",
      "default",
      "blank",
      "empty",
      "standard",
      "standardlevel0",
      "defaultstatic",
      "static",
    ];

    return placeholders;
  }

  checkIfNotInMotion(motionToCheckCheck) {
    const placeholders = this.getPlaceholderMotionFillerArray();

    // Use Array.prototype.includes() to check if the value is in the array
    if (placeholders.includes(motionToCheckCheck)) {
      return true; // Value is in the array
    } else {
      return false; // Value is not in the array
    }
  }

  getReversalSwitch(isInReverse) {
    return isInReverse ? -1.0 : 1.0;
  }
}
