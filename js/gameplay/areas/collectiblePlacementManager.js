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
   * Checks if player is near a collectible (generic function for all pickup types).
   *
   * Uses a two-phase check to be frame-rate independent:
   *  1. Point check  — is currentPosition within the trigger box?
   *  2. Segment sweep — did the movement path [previousPosition → currentPosition]
   *     pass through the trigger box this frame? Catches fast-motion tunneling
   *     where the endpoint alone would miss the collectible between frames.
   *
   * @param {PlayerUnit} player - The player unit
   * @param {BABYLON.Vector3} collectiblePosition - Position of the collectible
   * @returns {boolean} - Whether player is near the collectible
   */
  isPlayerNearCollectible(player, collectiblePosition) {
    if (!player || !collectiblePosition) {
      return false;
    }

    const pm = player.playerMovementManager;
    const currPos = pm.currentPosition;
    const cx = collectiblePosition.x;
    const cz = collectiblePosition.z;

    // Phase 1: point check at current position (handles stationary overlap too)
    if (Math.abs(cx - currPos.x) < 0.3 && Math.abs(cz - currPos.z) < 0.3) {
      return true;
    }

    // Phase 2: segment sweep — only meaningful while the player is actively moving
    // and previousPosition has been recorded for this frame.
    const prevPos = pm.previousPosition;
    if (pm.movementActive && prevPos) {
      const ax = prevPos.x, az = prevPos.z;
      const bx = currPos.x, bz = currPos.z;
      const segDx = bx - ax, segDz = bz - az;
      const lenSq = segDx * segDx + segDz * segDz;

      if (lenSq > 0) {
        // Find the parameter t of the closest point on segment AB to collectible C (in XZ)
        const t = Math.max(0, Math.min(1,
          ((cx - ax) * segDx + (cz - az) * segDz) / lenSq
        ));
        const closestX = ax + t * segDx;
        const closestZ = az + t * segDz;

        if (Math.abs(cx - closestX) < 0.3 && Math.abs(cz - closestZ) < 0.3) {
          return true;
        }
      }
    }

    return false;
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
