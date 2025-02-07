class LightingFrameUpdates {
  static LOGGING_ENABLED = true;
  constructor(lightingManager) {
    this.lightingManager = lightingManager;
    this.lightFrameIndex = 0;
  }

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

  possiblyUpdateLightHue(currentTime, lightObject) {
    let lightColorShift = lightObject.colorShiftProfile;

    if (!lightColorShift.colorShiftPaused) {
      let directionModifier = this.getLightReversal(
        lightObject.colorShiftInReverse
      );
      let timeModified = currentTime * directionModifier;

      if (lightColorShift.baseHue >= 0) {
        let light = lightObject.light;
        let newHue =
          lightColorShift.baseHue +
          lightColorShift.hueVariation *
            Math.sin(timeModified * lightColorShift.hueShiftSpeed);
        light.diffuse = this.hsvToRgb(newHue, 1, 1);

        if (
          newHue >= lightColorShift.baseHue + lightColorShift.hueVariation ||
          newHue <= lightColorShift.baseHue - lightColorShift.hueVariation
        ) {
          lightObject.toggleColorShiftDirection();
        }
      }
    }
  }

  //<========================Frame by frame processing
  /**
   *used to adjust light values over time by small increments to create complex Light aesthetics
   *through the strategic application of multiple different overlapping lights which blend together dynamically
   *capped at 155.52 million so that the lightFrameIndex never exceeds integer maximum values.
   *At 155.52 million, it resets to 0. At 60 frames per second this corresponds to 27,777 minutes of continuous gameplay
   *aka 30.0 non-stop days of gameplay. This will PROBABLY never occur, unless someone changes the code for incrementing light index,
   *and thus this is just ultra-cautious future proofed Light management.
   *Why bother with this? If there is a persistent game world, such as a virtual reality game server featuring a game that takes place
   *on an alien planet, its not inconveivable that there is a day / night cycle.
   *By default we are set to 60 minute hours and 24 hours per day with 30 day monthly cycles. On a complex planet
   *where day / nights have different values, then perhaps a server would have to track a value and force periodic resets with
   *special code to prevent integer overflow
   *Theoretically, this could also be relevant in the context of a live display of a game world / 3d environment in a museum or exhibit!
   */
  updateLightTimeAndFrame() {
    this.lightFrameIndex++;
    if (this.lightFrameIndex >= 155520000) {
      this.lightFrameIndex = 0;
    }
    const elapsedTime = performance.now() * 0.001;
    return elapsedTime;
  }

  processFrameOnPlayerModel(playerModel, chasingLight, playerPositionedObject) {
    if (
      playerModel != null &&
      chasingLight != null &&
      playerPositionedObject != null
    ) {
      let copyMe = playerPositionedObjec.getCompositePositionBaseline();
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
  processFrameOnActiveLightObjects(activeLightObjects) {
    let currentTime = this.updateLightTimeAndFrame();
    activeLightObjects.forEach((lightObject) => {
      this.possiblyUpdateLightHue(currentTime, lightObject);
      this.possiblyUpdateLightIntensity(currentTime, lightObject);
      this.possiblyUpdateLightPosition(currentTime, lightObject);
    });
  }

  intelligentLogForPlayerLightMovement(
    playerModel,
    chasingLight,
    playerPositionedObject
  ) {
    if (playerModel == null) {
      ChadUtilities.SmartLogger(
        LightingManager.lightingLoggingEnabled,
        "Player model null - Lighting frame updates!"
      );
    }
    if (chasingLight == null) {
      ChadUtilities.SmartLogger(
        LightingManager.lightingLoggingEnabled,
        "Player chasing light null - Lighting frame updates!"
      );
    }
    if (playerPositionedObject == null) {
      ChadUtilities.SmartLogger(
        LightingManager.lightingLoggingEnabled,
        "Player positioend object null - lighting frame updates!"
      );
    }
  }
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
        "Light object's motion profile was null!"
      );
    }
  }

  processLinearMotion(currentTime, lightObject, motionProfile) {
    if (motionProfile.pathCategory === "linear") {
      let light = lightObject.light;

      // Time step calculation (assuming time in seconds)
      let deltaTime = currentTime - (lightObject.lastUpdateTime || 0);
      lightObject.lastUpdateTime = currentTime;

      // Speed per second
      let speed = motionProfile.speed; // units per second

      // Compute movement vector (normalized direction * speed * time)
      let moveVector = motionProfile.direction.scale(speed * deltaTime);

      // Update position
      light.position.addInPlace(moveVector);
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
  processEccentricMotion(currentTime, lightObject, motionProfile) {}
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
