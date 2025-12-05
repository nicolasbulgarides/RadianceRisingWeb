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
    // Log that we're checking (throttled)
    if (!this._checkCallCount) this._checkCallCount = 0;
    this._checkCallCount++;
    if (this._checkCallCount === 1 || this._checkCallCount % 120 === 0) {
      //console.log(`[PICKUP CHECK] ✓ checkCollectibleForPickupEventTrigger() called (check ${this._checkCallCount})`);
    }

    if (!this.activeGameplayLevel) {
      // Try to get it from gameplayManager as fallback
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
      if (gameplayManager && gameplayManager.primaryActiveGameplayLevel) {
        this.activeGameplayLevel = gameplayManager.primaryActiveGameplayLevel;
        // console.log(`[PICKUP CHECK] Retrieved primaryActiveGameplayLevel from gameplayManager`);
      } else {
        if (!this._lastNoActiveLevelWarning || Date.now() - this._lastNoActiveLevelWarning > 5000) {
          // console.warn(`[PICKUP CHECK] CollectiblePlacementManager has no activeGameplayLevel!`);
          this._lastNoActiveLevelWarning = Date.now();
        }
        return false;
      }
    }

    let player = this.activeGameplayLevel.currentPrimaryPlayer;
    let collectibleLocation = microEvent.microEventLocation;

    if (!player) {
      // Only log occasionally to avoid spam
      if (!this._lastNoPlayerLog || Date.now() - this._lastNoPlayerLog > 5000) {
        //console.log(`[PICKUP CHECK] No player found in activeGameplayLevel. Registered players:`, this.activeGameplayLevel.registeredPlayers?.length || 0);
        this._lastNoPlayerLog = Date.now();
      }
      return false;
    }

    if (!collectibleLocation) {
      //console.log(`[PICKUP CHECK] No collectible location for event: ${microEvent.microEventNickname}`);
      return false;
    }

    // Use generic distance check for all collectibles (works for mangos, stardust, etc.)
    const isNear = this.isPlayerNearCollectible(player, collectibleLocation);

    if (isNear) {
      // console.log(`[PICKUP CHECK] Player is near collectible! Event: ${microEvent.microEventNickname}, Location:`, collectibleLocation);
    }

    return isNear;
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
   * Checks if player is near a collectible (generic function for all pickup types)
   * @param {PlayerUnit} player - The player unit
   * @param {BABYLON.Vector3} collectiblePosition - Position of the collectible
   * @returns {boolean} - Whether player is near the collectible
   */
  isPlayerNearCollectible(player, collectiblePosition) {
    if (!player || !collectiblePosition) {
      return false;
    }

    const playerPosition = player.playerMovementManager.currentPosition;

    // Calculate 2D distance (ignore Y difference for ground-level pickups)
    // This allows pickup while moving over the collectible at any Y position
    const dx = collectiblePosition.x - playerPosition.x;
    const dz = collectiblePosition.z - playerPosition.z;
    const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

    // Log distance check (only when close to avoid spam, and only occasionally)
    if (horizontalDistance < 2.0) {
      if (False && !this._lastDistanceLog || Date.now() - this._lastDistanceLog > 2000) {
        console.log(`[PICKUP DISTANCE] Player at (${playerPosition.x.toFixed(2)}, ${playerPosition.z.toFixed(2)}), Collectible at (${collectiblePosition.x.toFixed(2)}, ${collectiblePosition.z.toFixed(2)}), Distance: ${horizontalDistance.toFixed(2)}`);
        this._lastDistanceLog = Date.now();
      }
    }

    // Use a larger threshold (1.5 units) to make pickup easier while moving
    const isNear = horizontalDistance < 1.5;

    if (isNear) {
      // console.log(`[PICKUP DISTANCE] ✓ Within pickup range! Distance: ${horizontalDistance.toFixed(2)}`);
    }

    return isNear;
  }

  /**
   * Checks if player is near a mango (legacy function, kept for compatibility)
   * @param {PlayerUnit} player - The player unit
   * @param {BABYLON.Vector3} mangoPosition - Position of the mango
   * @returns {boolean} - Whether player is near the mango
   */
  isPlayerNearMango(player, mangoPosition) {
    return this.isPlayerNearCollectible(player, mangoPosition);
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
