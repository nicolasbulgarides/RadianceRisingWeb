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
  loadDirectionLightMotionPresets() {}
  loadPositionLightMotionPresets() {}
  loadPlayerDirectionLightMotionPresets() {}
  loadPlayerPositionLightMotionPresets() {}

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
}
