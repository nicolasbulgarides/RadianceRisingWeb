
class ScriptManifest {

  static animationScripts = [
    "/animations/datastructures/programmaticAnimation.js",
    "/animations/datastructures/programmaticAnimationHeader.js",
    "/animations/datastructures/programmaticAnimationPlaybackStatus.js",
    "/animations/datastructures/programmaticAnimationSequence.js",
    "/animations/datastructures/programmaticAnimationTriggerEvent.js",
    "/animations/datastructures/programmaticAnimationValues.js",
    "/animations/datastructures/programmaticFrameShift.js",
    "/animations/utilities/programmaticAnimationFrameShiftCalculator.js",
    "/animations/utilities/programmaticFactoryForAnimations.js",
    "/animations/utilities/programmaticAnimationInterpolator.js",
    "/animations/programmaticAnimationManager.js",
  ];

  static gamemodeScripts = [
    "/gameplay/gamemodes/gamemodeFactory.js",
    "/gameplay/gamemodes/specificmodes/gamemodeGeneric.js",
    "/gameplay/gamemodes/gamemodeEnforcings.js",
  ];

  static microEventScripts = [
    "/gameplay/interactions/microevents/microEvent.js",
    "/gameplay/interactions/microevents/microEventManager.js",
    "/gameplay/interactions/microevents/microEventSignal.js",
    "/gameplay/interactions/microevents/microEventFactory.js",
  ];

  static triggerScripts = [
    "/gameplay/interactions/triggers/datastructures/triggerHeader.js",
    "/gameplay/interactions/triggers/datastructures/triggerSpecialData.js",
    "/gameplay/interactions/triggers/datastructures/triggerBehavior.js",
    "/gameplay/interactions/triggers/datastructures/triggerEvent.js",
    "/gameplay/interactions/triggers/datastructures/triggerInstructionPreset.js",
    "/gameplay/interactions/triggers/datastructures/triggerInstruction.js",
    "/gameplay/interactions/triggers/activeTriggerManager.js",
    "/gameplay/interactions/triggers/triggerFactory.js",
  ];

  static occurrenceScripts = [
    "/gameplay/interactions/occurrences/specialOccurrenceComposite.js",
    "/gameplay/interactions/occurrences/specialOccurrenceManager.js",
    "/gameplay/interactions/occurrences/specialOccurrenceFactory.js",
    "/gameplay/interactions/occurrences/pickups/pickupOccurrenceSubManager.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceBasicData.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceHeader.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceItemData.js",

  ];
  static testToolScripts = [
    "/testtools/testManager.js",
    "/testtools/testLevelDataCompositeLoader.js",
    "/testtools/testLevelJsonBuilder.js",
  ];
  static assetManifestScripts = [
    "/utilities/assetmanifests/assetManifest.js",
    "/utilities/assetmanifests/assetManifestOverrides.js",
    "/utilities/assetmanifests/uiAssetManifest.js",
    "/utilities/assetmanifests/itemIconAssetManifest.js",
    "/utilities/assetmanifests/soundAssetManifest.js",
    "/utilities/assetmanifests/songAssetManifest.js",
  ];

  static assetLoadersAndManagersScripts = [
    "/utilities/loaders/positionedObject.js",
    "/utilities/loaders/modelLoader.js",
    "/utilities/loaders/modelLoadingLogger.js",
    "/utilities/loaders/animatedModelLoader.js",
    "/utilities/loaders/sceneBuilder.js",
    "/utilities/loaders/levelDataFileLoader.js",
  ];


  static uiUtilityScripts = [
    "/ui/utilities/loadingScreen.js",
    "/ui/utilities/responsiveUIManager.js",
    "/ui/utilities/renderSceneSwapper.js",
    "/ui/uiconstruction/basicfactories/buttonFactory.js",
    "/ui/uiconstruction/basicfactories/containerFactory.js",
    "/ui/uiconstruction/basicfactories/imageFactory.js",
    "/ui/uiconstruction/manaBar.js",
    "/ui/uiconstruction/artifactSocketBar.js",
    "/ui/uiconstruction/heartSocketBar.js",
  ];

  static uiSceneScriptsImplemented = [
    "/ui/scenes/implemented/uiSceneGeneralized.js",
    "/ui/scenes/implemented/baseGameUIScene.js",
    "/ui/scenes/implemented/gameWorldSceneGeneralized.js",
    "/ui/scenes/implemented/baseGameWorldScene.js",
    "/ui/scenes/implemented/worldLoaderScene.js",
    "/ui/scenes/implemented/experienceBarUIScene.js",
  ];

  static cheatPreventionScripts = [
    "/cheatprevention/cheatDetection.js",
    "/cheatprevention/cheatDetectionFactory.js",
    "/cheatprevention/cheatDetectionManager.js",
    "/cheatprevention/cheatPresets.js",
    "/cheatprevention/cheatLogger.js",
    "/cheatprevention/validatorGeneral.js",
  ];

  static lightingScripts = [
    "/lighting/lightingManager.js",
  ];

  static cameraScripts = [
    "/camera/cameraManager.js",
    "/camera/cameraInstructions.js",
  ];

  static gameplayScripts = [
    "/gameplay/levelEventSignal.js",
    "/gameplay/gameplayManagerComposite.js",
    "/gameplay/gameplayEndOfFrameCoordinator.js",
    "/gameplay/gameplayProgressionManager.js",
    "/gameplay/gameplayloggers/gameplayLogger.js",
    "/gameplay/gameplayloggers/movementLogger.js",
    "/gameplay/levelLoaderManager.js",
    "/gameplay/replay/movementTracker.js",
    "/gameplay/replay/levelReplayManager.js",
    "/gameplay/utilities/sequentialLevelLoader.js",

    //to do - reorganize
    "/gameplay/player/utilities/playerMovementManager.js",
    "/gameplay/action/movement/tileBoundaryDetector.js",
  ];

  static playerScripts = [
    "/gameplay/player/datastructures/playergamestate/playerStatusComposite.js",
    "/gameplay/player/datastructures/playergamestate/playerCurrentActionStatus.js",
    "/gameplay/player/datastructures/playergamestate/playerUnit.js",
    "/gameplay/player/datastructures/playergamestate/playerInventory.js",
    "/gameplay/player/utilities/playerLoader.js",
  ];

  static movementScripts = [
    "/gameplay/action/movement/movementDestinationManager.js",
    "/gameplay/action/movement/boundedDestinationCalculator.js",
    "/gameplay/action/movement/unboundedDestinationCalculator.js",
    "/gameplay/action/utilities/obstacleFinder.js",
  ];
  static gameInteractionsScripts = [
    "/gameplay/action/utilities/validActionChecker.js",
  ];

  static gameAreaScripts = [
    "/gameplay/areas/generation/datastructures/obstacle.js",
    "/gameplay/areas/generation/datastructures/levelVictoryCondition.js",
    "/gameplay/areas/generation/datastructures/levelObjective.js",
    "/gameplay/areas/generation/datastructures/levelFeaturedObject.js",
    "/gameplay/areas/generation/datastructures/levelHeaderData.js",
    "/gameplay/areas/generation/datastructures/levelGameplayTraitsData.js",
    "/gameplay/areas/generation/datastructures/levelDataComposite.js",
    "/gameplay/areas/generation/datastructures/boardSlot.js",
    "/gameplay/areas/generation/datastructures/activeGameplayLevel.js",
    "/gameplay/areas/generation/levelFactoryComposite.js",
    "/gameplay/areas/generation/gameGridGenerator.js",
    "/gameplay/areas/generation/levelMapObstacleGenerator.js",
    "/gameplay/areas/generation/datastructures/levelMap.js",
    "/gameplay/areas/collectiblePlacementManager.js",
    "/gameplay/areas/collectibleOccurrenceFactory.js",
  ];

  static soundSystemsScripts = [
    "/utilities/sound/soundEffectsManager.js",
    "/utilities/sound/musicManager.js",
  ];

  static minorUtilityScripts = [
    "/utilities/misc/chadUtilities.js",
    "/utilities/misc/timestampGenie.js",
    "/utilities/misc/randomAssist.js",
    "/utilities/misc/vectorAssist.js",
    "/utilities/starfieldBackdrop.js",
    "/utilities/fireballEffect.js",
    "/utilities/fireballEffect2.js",
    "/effects/effectGenerator.js",
  ];

  static developmentScripts = [
    "/development/playerMockInventory.js",
    "/testtools/example/mountainPathTest.js",
    "/gameplay/areas/generation/mountainPathVisualizer.js",
    "/gameplay/areas/generation/mountainPathGenerator.js",
    "/gameplay/areas/generation/mountainPuzzleLevelFactory.js",
    "/gameplay/items/item.js",
    "/gameplay/items/itemManager.js"
  ];

  /**
   * Loads a single script dynamically, ensuring proper sequential execution order.
   * Uses script tags with async=false to ensure scripts load and execute in order.
   * This is necessary because these scripts define global classes that need to be
   * available for inheritance in subsequent scripts.
   * 
   * @param {string} url - The URL of the script to load (already converted by getScriptUrl).
   * @returns {Promise<void>} Resolves when the script is successfully loaded and executed.
   */
  static loadScriptPromise(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = false;  // Critical: ensures scripts load and execute sequentially
      // Note: Not using type='module' because these scripts define global classes
      // that need to be immediately available for inheritance in subsequent scripts
      // Regular script tags ensure classes are in global scope immediately after execution

      // For regular scripts, onload fires after the script is loaded and executed
      // We add a small delay to ensure all class definitions are fully registered
      script.onload = () => {
        // Use requestAnimationFrame + microtask to ensure execution is complete
        // This is critical for inheritance - parent classes must be fully defined before child classes extend them
        requestAnimationFrame(() => {
          // Additional microtask to ensure class registration is complete
          Promise.resolve().then(() => {
            resolve();
          });
        });
      };

      script.onerror = () => {
        reject(new Error(`Failed to load script: ${url}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Converts a script path to the appropriate URL based on environment.
   * For local development, converts "/" to "./", for production uses the path as-is.
   * 
   * @param {string} path - The script path from the manifest.
   * @returns {string} The converted URL for script loading.
   */
  static getScriptUrl(path) {
    // Check if Config is available and determine if running locally
    // Default to true (local) if Config is not available
    const runLocally = typeof Config !== "undefined"
      ? Config.RUN_LOCALLY_DETERMINED
      : true;

    if (runLocally) {
      // Convert "/path/to/script.js" to "./path/to/script.js" for local development
      return path.startsWith("/") ? "." + path : path;
    } else {
      // For production, use the path as-is or prepend a base URL if needed
      // Assuming paths starting with "/" are relative to the js folder root
      return path;
    }
  }

  /**
   * Loads all scripts from the manifest in a logical order for game development/loading.
   * Tracks all failures and reports them in a single console.log statement.
   * 
   * @returns {Promise<void>} Resolves when all scripts have been attempted to load.
   */
  static async loadAllScriptsPromise() {
    // Define the logical loading order for game development/loading
    // Order: utilities -> assets -> systems -> gameplay -> UI -> development tools
    const loadingOrder = [
      "minorUtility",
      "assetManifest",
      "assetLoadersAndManagers",
      "animation",
      "lighting",
      "camera",
      "soundSystems",
      "player",
      "movement",
      "gameInteractions",
      "gameArea",
      "gamemode",
      "microEvent",
      "trigger",
      "gameplay",
      "uiUtility",
      "uiSceneImplemented",
      "testTool",
      "development",
      "occurrences"
    ];

    // Map loading order names to actual static property names
    const scriptCategoryMap = {
      "minorUtility": this.minorUtilityScripts,
      "assetManifest": this.assetManifestScripts,
      "assetLoadersAndManagers": this.assetLoadersAndManagersScripts,
      "animation": this.animationScripts,
      "lighting": this.lightingScripts,
      "camera": this.cameraScripts,
      "soundSystems": this.soundSystemsScripts,
      "player": this.playerScripts,
      "movement": this.movementScripts,
      "gameInteractions": this.gameInteractionsScripts,
      "gameArea": this.gameAreaScripts,
      "gamemode": this.gamemodeScripts,
      "microEvent": this.microEventScripts,
      "trigger": this.triggerScripts,
      "gameplay": this.gameplayScripts,
      "uiUtility": this.uiUtilityScripts,
      "uiSceneImplemented": this.uiSceneScriptsImplemented,
      "testTool": this.testToolScripts,
      "development": this.developmentScripts,
      "occurrences": this.occurrenceScripts,
    };

    const failedScripts = [];

    // Load scripts sequentially by category to maintain dependency order
    for (const categoryName of loadingOrder) {
      const scriptArray = scriptCategoryMap[categoryName];

      if (!scriptArray || scriptArray.length === 0) {
        continue;
      }

      // Load scripts SEQUENTIALLY within each category to maintain dependency order
      for (const scriptPath of scriptArray) {
        const scriptUrl = this.getScriptUrl(scriptPath);
        try {
          await this.loadScriptPromise(scriptUrl);
        } catch (error) {
          // Track the failure
          failedScripts.push(scriptPath);
          // Continue loading other scripts even if one fails
        }
      }
    }

    // Report all failures in a single console.log statement
    if (failedScripts.length > 0) {
      console.log(
        `Script Loading Complete - Failed Scripts (${failedScripts.length}):\n` +
        failedScripts.map((script, index) => `  ${index + 1}. ${script}`).join("\n")
      );
    } else {
      console.log("Script Loading Complete - All scripts loaded successfully.");
    }
  }
}
