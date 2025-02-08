class LightingMotionPresets {
  constructor() {
    this.directionLightMotionPresets = {};
    this.positionLightMotionPresets = {};
    this.playerPositionLightMotionPresets = {};
    this.playerDirectionLightMotionPresets = {};

    this.loadDefaultPathPresets();
    this.loadAllDesignedPresets();
  }
  loadAllDesignedPresets() {
    this.loadDirectionLightMotionPresets();
    this.loadPositionLightMotionPresets();
    this.loadPlayerPositionLightMotionPresets();
    this.loadPlayerDirectionLightMotionPresets();
  }
  loadDirectionLightMotionPresets() {}
  loadPositionLightMotionPresets() {}
  loadPlayerDirectionLightMotionPresets() {}
  loadPlayerPositionLightMotionPresets() {}

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
  // TO DO
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
  getPlayerDirectionLightMotionByPreset(motionPreset) {
    if (this.playerDirectionLightMotionPresets[motionPreset]) {
      return this.playerDirectionLightMotionPresets[motionPreset];
    } else {
      let playerMotionGeneric = this.getGenericDirectionLightMotion();
      this.playerDirectionLightMotionPresets["default"] = playerMotionGeneric;
      return this.playerDirectionLightMotionPresets["default"];
    }
  }

  getPlayerPositionLightMotionByPreset(motionPreset) {
    if (this.playerPositionLightMotionPresets[motionPreset]) {
      return this.playerPositionLightMotionPresets[motionPreset];
    } else {
      let playerMotionGeneric = this.getGenericPlayerPositionLightMotion();
      this.playerPositionLightMotionPresets["default"] = playerMotionGeneric;
      return this.playerPositionLightMotionPresets["default"];
    }
  }
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
