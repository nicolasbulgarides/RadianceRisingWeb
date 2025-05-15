/**
 * CollectiblePlacementManager handles the placement and management of collectible items in the game world.
 * Currently manages test mangos that appear on map tiles.
 */
class CollectiblePlacementManager {
  constructor(activeGameplayLevel = null) {
    this.activeGameplayLevel = activeGameplayLevel;
    this.sceneBuilder =
      FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene(
        "BaseGameScene"
      );

    this.microEventManager = FundamentalSystemBridge["microEventManager"];
    this.collectibles = {};
  }

  checkCollectibleForPickupEventTrigger(microEvent) {
    let player = this.activeGameplayLevel.currentPrimaryPlayer;
    let collectibleLocation = microEvent.microEventLocation;

    if (player && collectibleLocation) {
      let isPlayerNearMango = this.isPlayerNearMango(
        player,
        collectibleLocation
      );

      return isPlayerNearMango;
    } else {
      return false;
    }
  }

  /**
   * Sets the active gameplay level and initializes collectibles if needed
   * @param {ActiveGameplayLevel} gameplayLevel - The gameplay level to set
   */
  async setActiveGameplayLevel(gameplayLevel) {
    this.activeGameplayLevel = gameplayLevel;
    if (gameplayLevel && !this.isInitialized) {
      await this.placeMangosAtAllTiles();
    }
  }

  /**
   * Places mangos at every tile position in the level
   */
  async placeMangosAtAllTiles() {
    if (!this.activeGameplayLevel) {
      return;
    }

    const dimensions = this.activeGameplayLevel.getGridDimensions();

    for (let x = 0; x < dimensions.width; x++) {
      for (let z = 0; z < dimensions.depth; z++) {
        // Place mangos in a checkerboard pattern
        if ((x + z) % 2 === 0) {
          const position = new BABYLON.Vector3(x, 0, z);
          const tileId = `mango_${x}_${z}`;
          await this.placeTestMango(position, tileId);
        }
      }
    }

    this.isInitialized = true;
  }

  /**
   * Checks if player is near a mango
   * @param {BABYLON.Vector3} mangoPosition - Position of the mango
   * @returns {boolean} - Whether player is near the mango
   */
  isPlayerNearMango(player, mangoPosition) {
    if (!player || !mangoPosition) {
      return false;
    } else if (player && mangoPosition) {
      // Account for the Y-offset of the mango
      const adjustedMangoPosition = new BABYLON.Vector3(
        mangoPosition.x,
        mangoPosition.y - 0.25,
        mangoPosition.z
      );

      const distance = BABYLON.Vector3.Distance(
        player.playerMovementManager.currentPosition,
        adjustedMangoPosition
      );
      return distance < 1.0; // Increased threshold for better detection
    }
  }

  /**
   * Places a test mango at the specified position
   * @param {BABYLON.Vector3} position - The position to place the mango
   * @returns {PositionedObject} The created positioned object
   */
  async placeTestMango(position) {
    const mangoObject = this.generateTestMango(position);

    const loadedModel = await this.sceneBuilder.loadModel(mangoObject);

    // Create and register microevent for this mango using MicroEventFactory
    const mangoEvent = MicroEventFactory.generatePickup(
      "Mango Collection",
      "Player collected a mango",
      "mango",
      1,
      position,
      mangoObject
    );

    this.microEventManager.addNewMicroEventToLevel(
      { levelHeaderData: { levelId: "testLevel0" } },
      mangoEvent
    );
    /** 
    console.log(
      "Added mango event to level: " +
        "testLevel0" +
        " at location: " +
        position
    );
    */
  }

  generateTestMango(position) {
    const offset = new BABYLON.Vector3(0, 0.25, 0); // Slightly above the tile
    const rotation = new BABYLON.Vector3(0, 0, 0);
    const scale = 1.0; // Adjust scale as needed
    const mangoObject = new PositionedObject(
      "testMango",
      position,
      rotation,
      offset,
      "", // No animations for now
      "",
      "",
      scale,
      false, // Don't freeze
      true, // Make it interactive
      false // Not a clone base
    );

    return mangoObject;
  }
}
