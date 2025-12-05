/**
 * LightingMotionPresets Class
 *
 * Manages loading and retrieval of motion presets that control how lights move.
 * Supports presets for directional lights, positional lights, and player-specific lights.
 * Defaults are applied using placeholder keys and can be overridden with custom presets.
 */
class LightingMotionPresets {
  constructor() {
    this.directionLightMotionPresets = {};
    this.positionLightMotionPresets = {};
    this.playerPositionLightMotionPresets = {};
    this.playerDirectionLightMotionPresets = {};

    this.loadDefaultPathPresets();
    this.loadAllDesignedPresets();
  }

  /**
   * Loads all designed (custom) motion presets.
   */
  loadAllDesignedPresets() {
    this.loadDirectionLightMotionPresets();
    this.loadPositionLightMotionPresets();
    this.loadPlayerPositionLightMotionPresets();
    this.loadPlayerDirectionLightMotionPresets();
  }

  // Placeholder methods for loading presets
  loadDirectionLightMotionPresets() {
    // Create orbital motion preset for directional lights with different starting phases
    this.directionLightMotionPresets.orbitalCircular = this.getOrbitalDirectionLightMotion();
  }
  loadPositionLightMotionPresets() {
    // Create orbital motion preset for positional lights with different starting phases
    this.positionLightMotionPresets.orbitalCircular = this.getOrbitalPositionLightMotion();
  }
  loadPlayerDirectionLightMotionPresets() { }
  loadPlayerPositionLightMotionPresets() { }

  /**
   * Loads the default motion presets and applies them to standard placeholder keys.
   */
  loadDefaultPathPresets() {
    let defaultDirectionLightMotionStatic =
      this.getGenericDirectionLightMotion();
    let defaultPositionLightMotionStatic = this.getGenericPositionLightMotion();
    let defaultPlayerPositionLightMotionStatic =
      this.getGenericPlayerPositionLightMotion();

    let placeholders = this.getPlaceholderFillerArray();
    placeholders.forEach((key) => {
      this.playerDirectionLightMotionPresets[key] =
        defaultDirectionLightMotionStatic;
      this.playerPositionLightMotionPresets[key] =
        defaultPlayerPositionLightMotionStatic;
      this.directionLightMotionPresets[key] = defaultDirectionLightMotionStatic;
      this.positionLightMotionPresets[key] = defaultPositionLightMotionStatic;
    });
  }

  /**
   * Returns an array of placeholder strings for motion presets.
   * @returns {Array<string>}
   */
  getPlaceholderFillerArray() {
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

  /**
   * Retrieves a player's directional light motion preset by name.
   * @param {string} motionPreset - Preset identifier.
   * @returns {LightingMotionProfileBag}
   */
  getPlayerDirectionLightMotionByPreset(motionPreset) {
    if (this.playerDirectionLightMotionPresets[motionPreset]) {
      return this.playerDirectionLightMotionPresets[motionPreset];
    } else {
      let playerMotionGeneric = this.getGenericDirectionLightMotion();
      this.playerDirectionLightMotionPresets["default"] = playerMotionGeneric;
      return this.playerDirectionLightMotionPresets["default"];
    }
  }

  /**
   * Retrieves a player's positional light motion preset by name.
   * @param {string} motionPreset - Preset identifier.
   * @returns {LightingMotionProfileBag}
   */
  getPlayerPositionLightMotionByPreset(motionPreset) {
    if (this.playerPositionLightMotionPresets[motionPreset]) {
      return this.playerPositionLightMotionPresets[motionPreset];
    } else {
      let playerMotionGeneric = this.getGenericPlayerPositionLightMotion();
      this.playerPositionLightMotionPresets["default"] = playerMotionGeneric;
      return this.playerPositionLightMotionPresets["default"];
    }
  }

  /**
   * Returns a generic motion preset for a player's positional light.
   * @returns {LightingMotionProfileBag}
   */
  getGenericPlayerPositionLightMotion() {
    let positionGeneric = new BABYLON.Vector3(0, 0, 0);
    let presetId = "default";
    let ids = ["default"];
    let pathCategories = ["static"];
    let allPositions = [positionGeneric];
    let blankSpeed = new BABYLON.Vector3(0, 0, 0);
    let allBaseSpeeds = [blankSpeed];
    let blankDistance = new BABYLON.Vector3(0, 0, 0);
    let allDistances = [blankDistance];
    let allStartMomentRatios = [0];
    let allDoesLoop = [false];
    let allTeleportsOrReverses = ["static"];
    let allOnEndInteractions = ["none"];

    return new LightingMotionProfileBag(
      presetId,
      ids,
      pathCategories,
      allPositions,
      allBaseSpeeds,
      allDistances,
      allStartMomentRatios,
      allDoesLoop,
      allTeleportsOrReverses,
      allOnEndInteractions
    );
  }

  /**
   * Returns a generic motion preset for directional lights.
   * @returns {LightingMotionProfileBag}
   */
  getGenericDirectionLightMotion() {
    let lightRightDown = new BABYLON.Vector3(1, -1, 0);
    let lightLeftDown = new BABYLON.Vector3(-1, -1, 0);
    let lightRightUp = new BABYLON.Vector3(1, 1, 0);
    let lightLeftUp = new BABYLON.Vector3(-1, 1, 0);

    let presetId = "default";
    let ids = ["rightDown", "leftDown", "rightUp", "leftUp"];
    let pathCategories = ["static", "static", "static", "static"];
    let allDirectionPositions = [
      lightRightDown,
      lightRightUp,
      lightLeftDown,
      lightLeftUp,
    ];
    let blankSpeed = new BABYLON.Vector3(0, 0, 0);
    let allBaseSpeeds = [blankSpeed, blankSpeed, blankSpeed, blankSpeed];
    let blankDistance = new BABYLON.Vector3(0, 0, 0);
    let allDistances = [
      blankDistance,
      blankDistance,
      blankDistance,
      blankDistance,
    ];
    let allStartMomentRatios = [0, 0, 0, 0];
    let allDoesLoop = [true, true, true, true];
    let allTeleportsOrReverses = ["static", "static", "static", "static"];
    let allOnEndInteractions = ["none", "none", "none", "none"];

    let bag = new LightingMotionProfileBag(
      presetId,
      ids,
      pathCategories,
      allDirectionPositions,
      allBaseSpeeds,
      allDistances,
      allStartMomentRatios,
      allDoesLoop,
      allTeleportsOrReverses,
      allOnEndInteractions
    );
    return bag;
  }

  /**
   * Returns a generic motion preset for positional lights.
   * @returns {LightingMotionProfileBag}
   */
  getGenericPositionLightMotion() {
    let deepLeftCorner = new BABYLON.Vector3(0, 1, 20);
    let shallowLeftCorner = new BABYLON.Vector3(0, 1, 0);
    let deepRightCorner = new BABYLON.Vector3(10, 1, 20);
    let shallowRightCorner = new BABYLON.Vector3(0, 1, 20);

    let presetId = "default";
    let ids = [
      "deepLeftCorner",
      "shallowLeftCorner",
      "deepRightCorner",
      "shallowRightCorner",
    ];
    let pathCategories = ["static", "static", "static", "static"];
    let allCornerPositions = [
      deepLeftCorner,
      shallowRightCorner,
      deepRightCorner,
      shallowLeftCorner,
    ];
    let blankSpeed = new BABYLON.Vector3(0, 0, 0);
    let allBaseSpeeds = [blankSpeed, blankSpeed, blankSpeed, blankSpeed];
    let blankDistance = new BABYLON.Vector3(0, 0, 0);
    let allDistances = [
      blankDistance,
      blankDistance,
      blankDistance,
      blankDistance,
    ];
    let allStartMomentRatios = [0, 0, 0, 0];
    let allDoesLoop = [false, false, false, false];
    let allTeleportsOrReverses = ["static", "static", "static", "static"];
    let allOnEndInteractions = ["none", "none", "none", "none"];

    return new LightingMotionProfileBag(
      presetId,
      ids,
      pathCategories,
      allCornerPositions,
      allBaseSpeeds,
      allDistances,
      allStartMomentRatios,
      allDoesLoop,
      allTeleportsOrReverses,
      allOnEndInteractions
    );
  }

  /**
   * Retrieves a directional light motion preset by name.
   * @param {string} presetName - Preset identifier.
   * @returns {LightingMotionProfileBag}
   */
  getDirectionLightMotionPresetByName(presetName) {
    if (this.directionLightMotionPresets[presetName]) {
      return this.directionLightMotionPresets[presetName];
    } else if (this.directionLightMotionPresets["default"]) {
      return this.directionLightMotionPresets["default"];
    } else {
      this.loadDefaultPathPresets();
      return this.directionLightMotionPresets["default"];
    }
  }

  /**
   * Retrieves a positional light motion preset by name.
   * @param {string} presetName - Preset identifier.
   * @returns {LightingMotionProfileBag}
   */
  getPositionLightMotionPresetByName(presetName) {
    if (this.positionLightMotionPresets[presetName]) {
      return this.positionLightMotionPresets[presetName];
    } else if (this.positionLightMotionPresets["default"]) {
      return this.positionLightMotionPresets["default"];
    } else {
      this.loadDefaultPathPresets();
      return this.positionLightMotionPresets["default"];
    }
  }

  /**
   * Creates an orbital motion preset for directional lights.
   * Each light orbits in a circular path with different starting phases, sizes, heights, and speeds.
   * @returns {LightingMotionProfileBag}
   */
  getOrbitalDirectionLightMotion() {
    // Orbit centers - positioned at different heights above the board (Y axis varies)
    // Light 1: Small orbit, low height
    let orbitCenter1 = new BABYLON.Vector3(0, 6, 0);
    // Light 2: Medium orbit, medium height
    let orbitCenter2 = new BABYLON.Vector3(0, 10, 0);
    // Light 3: Large orbit, high height
    let orbitCenter3 = new BABYLON.Vector3(0, 14, 0);
    // Light 4: Medium orbit, medium-high height
    let orbitCenter4 = new BABYLON.Vector3(0, 12, 0);

    let presetId = "orbitalCircular";
    let ids = ["orbit1", "orbit2", "orbit3", "orbit4"];
    let pathCategories = ["orbital", "orbital", "orbital", "orbital"];

    // Different starting phases for each light (0 to 1, representing 0 to 2π)
    // This creates offset starting positions in the orbit
    let startPhase1 = new BABYLON.Vector3(0.0, 0.0, 0.0);      // Start at 0°
    let startPhase2 = new BABYLON.Vector3(0.25, 0.25, 0.25);   // Start at 90°
    let startPhase3 = new BABYLON.Vector3(0.5, 0.5, 0.5);      // Start at 180°
    let startPhase4 = new BABYLON.Vector3(0.75, 0.75, 0.75);  // Start at 270°

    // Orbit radii - DIFFERENT sizes for each light
    // Format: (X radius, Y radius, Z radius)
    // Light 1: Small horizontal circle (XZ plane)
    let orbitRadius1 = new BABYLON.Vector3(4, 0.5, 4);   // Small circle, slight vertical wobble
    // Light 2: Medium horizontal circle
    let orbitRadius2 = new BABYLON.Vector3(7, 1, 7);      // Medium circle, more vertical variation
    // Light 3: Large horizontal circle
    let orbitRadius3 = new BABYLON.Vector3(12, 1.5, 12);  // Large circle, significant vertical variation
    // Light 4: Medium-large horizontal circle, but more elliptical
    let orbitRadius4 = new BABYLON.Vector3(9, 2, 6);     // Elliptical orbit (wider in X than Z)

    // Orbit speeds - DIFFERENT speeds and directions for each light
    // Format: (X speed, Y speed, Z speed) in radians per second
    // Light 1: Slow, counter-clockwise
    let orbitSpeed1 = new BABYLON.Vector3(0.25, 0.15, 0.25);  // Slow orbit
    // Light 2: Medium speed, clockwise (negative would reverse, but we'll use different phase)
    let orbitSpeed2 = new BABYLON.Vector3(0.4, 0.2, 0.4);     // Medium speed
    // Light 3: Fast orbit
    let orbitSpeed3 = new BABYLON.Vector3(0.5, 0.25, 0.5);     // Fast orbit
    // Light 4: Medium-fast, but different X/Z ratio for elliptical path
    let orbitSpeed4 = new BABYLON.Vector3(0.35, 0.3, 0.45);    // Different speeds for X and Z (elliptical)

    let allStartMomentRatios = [startPhase1, startPhase2, startPhase3, startPhase4];
    let allOrbitCenters = [orbitCenter1, orbitCenter2, orbitCenter3, orbitCenter4];
    let allOrbitRadii = [orbitRadius1, orbitRadius2, orbitRadius3, orbitRadius4];
    let allOrbitSpeeds = [orbitSpeed1, orbitSpeed2, orbitSpeed3, orbitSpeed4];
    let allDoesLoop = [true, true, true, true];
    let allTeleportsOrReverses = ["orbital", "orbital", "orbital", "orbital"];
    let allOnEndInteractions = ["none", "none", "none", "none"];

    return new LightingMotionProfileBag(
      presetId,
      ids,
      pathCategories,
      allOrbitCenters,
      allOrbitSpeeds,
      allOrbitRadii,
      allStartMomentRatios,
      allDoesLoop,
      allTeleportsOrReverses,
      allOnEndInteractions
    );
  }

  /**
   * Creates an orbital motion preset for positional lights.
   * Each light orbits in a circular path with different starting phases, sizes, heights, and speeds.
   * @returns {LightingMotionProfileBag}
   */
  getOrbitalPositionLightMotion() {
    // Orbit centers - positioned at different heights above the board (Y axis varies)
    // Light 1: Small orbit, low height
    let orbitCenter1 = new BABYLON.Vector3(0, 5, 0);
    // Light 2: Medium orbit, medium height
    let orbitCenter2 = new BABYLON.Vector3(0, 8, 0);
    // Light 3: Large orbit, high height
    let orbitCenter3 = new BABYLON.Vector3(0, 12, 0);
    // Light 4: Medium orbit, medium-high height
    let orbitCenter4 = new BABYLON.Vector3(0, 10, 0);

    let presetId = "orbitalCircular";
    let ids = ["orbit1", "orbit2", "orbit3", "orbit4"];
    let pathCategories = ["orbital", "orbital", "orbital", "orbital"];

    // Different starting phases for each light (0 to 1, representing 0 to 2π)
    let startPhase1 = new BABYLON.Vector3(0.0, 0.0, 0.0);      // Start at 0°
    let startPhase2 = new BABYLON.Vector3(0.25, 0.25, 0.25);   // Start at 90°
    let startPhase3 = new BABYLON.Vector3(0.5, 0.5, 0.5);      // Start at 180°
    let startPhase4 = new BABYLON.Vector3(0.75, 0.75, 0.75);  // Start at 270°

    // Orbit radii - DIFFERENT sizes for each light
    // Format: (X radius, Y radius, Z radius)
    // Light 1: Small horizontal circle (XZ plane)
    let orbitRadius1 = new BABYLON.Vector3(5, 1, 5);    // Small circle, slight vertical wobble
    // Light 2: Medium horizontal circle
    let orbitRadius2 = new BABYLON.Vector3(8, 1.5, 8);   // Medium circle, more vertical variation
    // Light 3: Large horizontal circle
    let orbitRadius3 = new BABYLON.Vector3(15, 2, 15);  // Large circle, significant vertical variation
    // Light 4: Medium-large horizontal circle, but more elliptical
    let orbitRadius4 = new BABYLON.Vector3(10, 2.5, 7);  // Elliptical orbit (wider in X than Z)

    // Orbit speeds - DIFFERENT speeds for each light
    // Format: (X speed, Y speed, Z speed) in radians per second
    // Light 1: Slow orbit
    let orbitSpeed1 = new BABYLON.Vector3(0.2, 0.1, 0.2);   // Slow orbit
    // Light 2: Medium speed
    let orbitSpeed2 = new BABYLON.Vector3(0.35, 0.15, 0.35); // Medium speed
    // Light 3: Fast orbit
    let orbitSpeed3 = new BABYLON.Vector3(0.45, 0.2, 0.45);  // Fast orbit
    // Light 4: Medium-fast, but different X/Z ratio for elliptical path
    let orbitSpeed4 = new BABYLON.Vector3(0.3, 0.25, 0.4);   // Different speeds for X and Z (elliptical)

    let allStartMomentRatios = [startPhase1, startPhase2, startPhase3, startPhase4];
    let allOrbitCenters = [orbitCenter1, orbitCenter2, orbitCenter3, orbitCenter4];
    let allOrbitRadii = [orbitRadius1, orbitRadius2, orbitRadius3, orbitRadius4];
    let allOrbitSpeeds = [orbitSpeed1, orbitSpeed2, orbitSpeed3, orbitSpeed4];
    let allDoesLoop = [true, true, true, true];
    let allTeleportsOrReverses = ["orbital", "orbital", "orbital", "orbital"];
    let allOnEndInteractions = ["none", "none", "none", "none"];

    return new LightingMotionProfileBag(
      presetId,
      ids,
      pathCategories,
      allOrbitCenters,
      allOrbitSpeeds,
      allOrbitRadii,
      allStartMomentRatios,
      allDoesLoop,
      allTeleportsOrReverses,
      allOnEndInteractions
    );
  }
}
