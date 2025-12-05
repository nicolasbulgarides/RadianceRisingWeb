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
  possiblyUpdateLightPosition() { }

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

      const baseIntensity = Number(lightShift.baseLightIntensity) || 1.0;
      const amplitude = Number(lightShift.baseLightIntensityAmplitude) || 0;
      const speed = Number(lightShift.baseLightIntensitySpeed) || 0;
      const phase = Number(lightShift.lightIntensityPhaseRatio) || 0;

      let updatedLightIntensity =
        baseIntensity +
        amplitude *
        Math.sin(
          currentTime * speed * timeReversalFactor + phase
        );

      // Ensure intensity is always positive and reasonable
      updatedLightIntensity = Math.max(0.1, updatedLightIntensity);
      lightObject.light.intensity = updatedLightIntensity;

      // Check bounds for auto-reverse (if enabled)
      if (lightShift.autoReverse) {
        if (
          updatedLightIntensity >=
          baseIntensity + amplitude ||
          updatedLightIntensity <=
          baseIntensity - amplitude
        ) {
          lightObject.toggleLightIntensityDirection();
        }
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

    if (!lightObject.colorShiftPaused && lightObject.light) {
      let light = lightObject.light; // Declare light outside the if block
      let directionModifier = this.getReversalSwitch(
        lightObject.colorShiftInReverse
      );
      let timeModified = currentTime * directionModifier;

      const baseHue = Number(lightColorShift.baseHue) || 0;
      const hueVariation = Number(lightColorShift.hueVariation) || 0;
      const hueSpeed = Number(lightColorShift.hueShiftSpeed) || 0;

      if (baseHue > 0 || hueVariation > 0) {
        // Ensure hueSpeed is properly converted and scaled for visible animation
        const effectiveHueSpeed = hueSpeed > 0 ? hueSpeed : 0.5;
        let newHue =
          baseHue +
          hueVariation *
          Math.sin(timeModified * effectiveHueSpeed);

        // Wrap hue to 0-1 range
        newHue = newHue % 1.0;
        if (newHue < 0) newHue += 1.0;

        // Convert HSV to RGB and apply to light
        const newColor = this.lightingManager.lightingFactory.lightingPropertyCalculator.hsvToRgb(
          newHue,
          1,
          1
        );
        light.diffuse = newColor;

        // Debug: Log first few updates to verify animation is working
        if (this.lightFrameIndex < 5 && lightObject.lightNickname === "Env Light: 0") {
          // console.log(`[LIGHTING ANIMATION] Frame ${this.lightFrameIndex}, time: ${currentTime.toFixed(2)}, hue: ${newHue.toFixed(3)}, color: RGB(${newColor.r.toFixed(2)}, ${newColor.g.toFixed(2)}, ${newColor.b.toFixed(2)})`);
        }

        // Check bounds for auto-reverse (if enabled)
        if (lightColorShift.autoReverse) {
          if (
            newHue >= baseHue + hueVariation ||
            newHue <= baseHue - hueVariation
          ) {
            lightObject.toggleColorShiftDirection();
          }
        }
      } else if (!light.diffuse || (light.diffuse.r === 0 && light.diffuse.g === 0 && light.diffuse.b === 0)) {
        // Fallback to white if no hue is specified
        light.diffuse = new BABYLON.Color3(1, 1, 1);
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
    // Use performance.now() for consistent time tracking across frames
    // Convert to seconds for animation calculations
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
    if (activeLightObjects.length > 0) {
      activeLightObjects.forEach((lightObject) => {
        if (lightObject && lightObject.light) {
          this.possiblyUpdateLightHue(currentTime, lightObject);
          this.possiblyUpdateLightIntensity(currentTime, lightObject);
          this.possiblyUpdateLightPosition(currentTime, lightObject);
        }
      });
    }
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
      let possibleReversal = this.getReversalSwitch(lightObject.motionInReverse);
      let orbitSpeed = motionProfile.baseSpeed; // Speed vector (x, y, z)
      let orbitCenter = motionProfile.basePosition;
      let orbitRadius = motionProfile.radiusOrDistance;

      let adjustedTime = currentTime * possibleReversal;

      // Convert phase ratio (0 to 1) into radians (0 to 2π)
      // Handle both Vector3 and number formats for startMomentRatio
      let phaseX, phaseY, phaseZ;
      if (motionProfile.startMomentRatio instanceof BABYLON.Vector3) {
        phaseX = motionProfile.startMomentRatio.x * 2 * Math.PI;
        phaseY = motionProfile.startMomentRatio.y * 2 * Math.PI;
        phaseZ = motionProfile.startMomentRatio.z * 2 * Math.PI;
      } else {
        // If it's a number, use it as a uniform phase offset
        const phase = (motionProfile.startMomentRatio || 0) * 2 * Math.PI;
        phaseX = phase;
        phaseY = phase;
        phaseZ = phase;
      }

      // Calculate new positions using sine and cosine
      const angleX = adjustedTime * (orbitSpeed.x || 0.5) + phaseX;
      const x = orbitCenter.x + (orbitRadius.x || 5) * Math.cos(angleX);

      const angleY = adjustedTime * (orbitSpeed.y || 0.5) + phaseY;
      const y = orbitCenter.y + (orbitRadius.y || 5) * Math.sin(angleY);

      const angleZ = adjustedTime * (orbitSpeed.z || 0.5) + phaseZ;
      const z = orbitCenter.z + (orbitRadius.z || 5) * Math.cos(angleZ);

      // Update the light's position (for positional lights) or direction (for directional lights)
      if (light instanceof BABYLON.PointLight || light instanceof BABYLON.SpotLight) {
        // Positional lights - update position
        light.position = new BABYLON.Vector3(x, y, z);
      } else if (light instanceof BABYLON.DirectionalLight) {
        // Directional lights - update direction vector (normalized)
        const direction = new BABYLON.Vector3(x, y, z);
        direction.normalize();
        light.direction = direction;
      } else {
        // Fallback - try position first, then direction
        if (light.position !== undefined) {
          light.position = new BABYLON.Vector3(x, y, z);
        } else if (light.direction !== undefined) {
          const direction = new BABYLON.Vector3(x, y, z);
          direction.normalize();
          light.direction = direction;
        }
      }
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
