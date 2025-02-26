/**
 * Example of how to use the accomplishment emitter system in a combat system.
 * This is a simplified example to demonstrate the pattern.
 */
class CombatSystemExample {
  /**
   * Creates a new combat system.
   *
   * @param {AccomplishmentEmitterRegistry} emitterRegistry - The emitter registry
   */
  constructor(emitterRegistry) {
    this.emitterRegistry = emitterRegistry;
    this.combatEmitter = emitterRegistry.getEmitter("combat");
  }

  /**
   * Processes the result of a combat encounter.
   *
   * @param {Player} player - The player involved in combat
   * @param {Array<Enemy>} enemies - The enemies involved in combat
   * @param {Object} combatStats - Statistics about the combat encounter
   */
  processCombatResult(player, enemies, combatStats) {
    // Game logic for processing combat result
    // ...

    // Emit appropriate accomplishments based on the combat outcome
    if (combatStats.victory) {
      // Check if any enemies are bosses
      if (enemies.some((e) => e.type === "boss")) {
        this.processBossDefeatAccomplishment(player, enemies, combatStats);
      } else {
        this.processEnemyDefeatAccomplishment(player, enemies, combatStats);
      }

      // Check if the player took no damage
      if (combatStats.playerDamageTaken === 0) {
        this.processFlawlessVictoryAccomplishment(player, enemies, combatStats);
      }

      // Check for combat milestones
      this.checkCombatMilestones(player, enemies, combatStats);
    }
  }

  /**
   * Processes a standard enemy defeat accomplishment.
   *
   * @param {Player} player - The player involved in combat
   * @param {Array<Enemy>} enemies - The enemies involved in combat
   * @param {Object} combatStats - Statistics about the combat encounter
   */
  processEnemyDefeatAccomplishment(player, enemies, combatStats) {
    // Simple one-liner to emit the accomplishment with custom data
    this.combatEmitter.emit("enemyDefeated", {
      idsOfDefeatedEntities: enemies.map((e) => e.id),
      idsOfVictorEntities: [player.id],
      combatEventLocation: player.currentLocation,
      combatEventDifficultyTier: Math.max(
        ...enemies.map((e) => e.difficultyTier)
      ),
    });
  }

  /**
   * Processes a boss defeat accomplishment.
   *
   * @param {Player} player - The player involved in combat
   * @param {Array<Enemy>} enemies - The enemies involved in combat
   * @param {Object} combatStats - Statistics about the combat encounter
   */
  processBossDefeatAccomplishment(player, enemies, combatStats) {
    // Filter for boss enemies
    const bossEnemies = enemies.filter((e) => e.type === "boss");

    // Emit the boss defeat accomplishment
    this.combatEmitter.emit("bossDefeated", {
      idsOfDefeatedEntities: bossEnemies.map((e) => e.id),
      idsOfVictorEntities: [player.id],
      combatEventLocation: player.currentLocation,
      combatEventDifficultyTier: Math.max(
        ...bossEnemies.map((e) => e.difficultyTier)
      ),
      combatEventRarityTier: "epic",
    });
  }

  /**
   * Processes a flawless victory accomplishment.
   *
   * @param {Player} player - The player involved in combat
   * @param {Array<Enemy>} enemies - The enemies involved in combat
   * @param {Object} combatStats - Statistics about the combat encounter
   */
  processFlawlessVictoryAccomplishment(player, enemies, combatStats) {
    // Emit the flawless victory accomplishment
    this.combatEmitter.emit("flawlessVictory", {
      idsOfDefeatedEntities: enemies.map((e) => e.id),
      idsOfVictorEntities: [player.id],
      combatEventLocation: player.currentLocation,
      otherRelevantData: {
        damageTaken: 0,
        totalEnemies: enemies.length,
        combatDuration: combatStats.duration,
      },
    });
  }

  /**
   * Checks for combat-related milestones.
   *
   * @param {Player} player - The player involved in combat
   * @param {Array<Enemy>} enemies - The enemies involved in combat
   * @param {Object} combatStats - Statistics about the combat encounter
   */
  checkCombatMilestones(player, enemies, combatStats) {
    // Get player's combat stats
    const totalEnemiesDefeated =
      player.stats.totalEnemiesDefeated + enemies.length;

    // Check for milestone thresholds
    const milestoneThresholds = [10, 50, 100, 500, 1000];

    // Find the highest threshold that was just crossed
    const crossedThreshold = milestoneThresholds.find(
      (threshold) =>
        player.stats.totalEnemiesDefeated < threshold &&
        totalEnemiesDefeated >= threshold
    );

    // If a threshold was crossed, emit a milestone accomplishment
    if (crossedThreshold) {
      this.combatEmitter.emit("combatMilestone", {
        otherRelevantData: {
          milestoneType: "enemies-defeated",
          milestoneValue: crossedThreshold,
        },
      });
    }
  }
}

// Example usage:
// const emitterRegistry = AccomplishmentEmitterRegistry.getInstance(progressionManager);
// const combatSystem = new CombatSystemExample(emitterRegistry);
//
// // Later, when combat is resolved:
// combatSystem.processCombatResult(player, enemies, combatStats);
