class LightingPathPresets {
  constructor() {
    this.directionLightMotionPresets = {};
    this.positionLightMotionPresets = {};
    this.playerPositionLightPresets = {};

    this.loadDefaultPathPresets();
    this.loadDirectionLightPathPresets();
    this.loadPositionLightPathPresets();
    this.loadPlayerPositionLightPresets();
  }

  getPlayerLightBasicOffsetByPreset(lightOffsetPreset) {
    switch (lightOffsetPreset) {
      case "updateme":
        return new BABYLON.Vector3(0, 5, 0);
    }

    if (this.playerPositionLightPresets["default"]) {
      return this.playerPositionLightPresets["default"];
    } else {
      this.loadDefaultPathPresets();
      return this.playerPositionLightPresets["default"];
    }
  }

  loadDefaultPathPresets() {
    let defaultDirectionLightMotionStatic =
      this.getGenericDirectionLightMotion();
    let defaultPositionLightMotionStatic = this.getGenericPositionLightMotion();

    let placeholders = this.getPlaceholderFillerArray();
    placeholders.forEach((key) => {
      this.directionLightMotionPresets[key] = defaultDirectionLightMotionStatic;
      this.positionLightMotionPresets[key] = defaultPositionLightMotionStatic;
    });
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

    return new LightingMotionProfileBag(
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
      return this.positionLightPresets["default"];
    } else {
      this.loadDefaultPathPresets();
      return this.positionLightMotionPresets["default"];
    }
  }
}
