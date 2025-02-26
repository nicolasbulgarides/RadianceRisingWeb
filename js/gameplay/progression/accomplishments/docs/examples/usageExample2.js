/**
 * Usage examples for the Accomplishment Emitter system.
 *
 * This file provides examples of how to use the accomplishment emitter system
 * in various game scenarios.
 */

/**
 * Example: Combat System Integration
 *
 * This example shows how to integrate the accomplishment emitter system
 * with a combat system to track combat-related accomplishments.
 */
class CombatSystemExample {
  constructor(accomplishmentManager) {
    this.registry = new AccomplishmentEmitterRegistry();
    this.accomplishmentManager = accomplishmentManager;
  }

  /**
   * Handle enemy defeat event
   *
   * @param {Object} player - The player who defeated the enemy
   * @param {Object} enemy - The enemy that was defeated
   * @param {Object} combatStats - Statistics about the combat
   */
  handleEnemyDefeated(player, enemy, combatStats) {
    // Check if this is a boss enemy
    if (enemy.isBoss) {
      // Create a boss defeated accomplishment
      const accomplishmentData = this.registry.createFromPreset(
        "combat",
        "bossDefeated",
        {
          enemyId: enemy.id,
          enemyName: enemy.name,
          enemyLevel: enemy.level,
          playerLevel: player.level,
          damageDealt: combatStats.totalDamageDealt,
          timeToDefeat: combatStats.combatDuration,
          wasFirstDefeat: !player.hasDefeatedBoss(enemy.id),
        }
      );

      // Submit the accomplishment to the manager
      if (accomplishmentData) {
        this.accomplishmentManager.trackAccomplishment(accomplishmentData);
      }
    } else {
      // Create a regular enemy defeated accomplishment
      const accomplishmentData = this.registry.createFromPreset(
        "combat",
        "enemyDefeated",
        {
          enemyId: enemy.id,
          enemyName: enemy.name,
          enemyLevel: enemy.level,
          playerLevel: player.level,
          damageDealt: combatStats.totalDamageDealt,
          timeToDefeat: combatStats.combatDuration,
        }
      );

      // Submit the accomplishment to the manager
      if (accomplishmentData) {
        this.accomplishmentManager.trackAccomplishment(accomplishmentData);
      }
    }

    // Check for combat milestone (e.g., defeating 100 enemies)
    const totalEnemiesDefeated = player.getStatistic("totalEnemiesDefeated");
    if (totalEnemiesDefeated % 100 === 0) {
      const milestoneData = this.registry.createFromPreset(
        "combat",
        "combatMilestone",
        {
          milestoneType: "enemiesDefeated",
          milestoneValue: totalEnemiesDefeated,
          playerLevel: player.level,
        }
      );

      if (milestoneData) {
        this.accomplishmentManager.trackAccomplishment(milestoneData);
      }
    }
  }

  /**
   * Handle player level up in combat skill
   *
   * @param {Object} player - The player who leveled up
   * @param {string} skillName - The name of the skill that leveled up
   * @param {number} newLevel - The new level of the skill
   */
  handleCombatSkillLevelUp(player, skillName, newLevel) {
    // Create a skill level up accomplishment
    const accomplishmentData = this.registry.createFromPreset(
      "progression",
      "skillLevelUp",
      {
        progressionType: "combat",
        skillName: skillName,
        skillCategory: "combat",
        newLevel: newLevel,
        previousLevel: newLevel - 1,
        isSignificantMilestone: newLevel % 10 === 0, // Every 10 levels is significant
        unlockableFeatures: player.getUnlocksAtLevel(skillName, newLevel),
      }
    );

    if (accomplishmentData) {
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    }
  }
}

/**
 * Example: Quest System Integration
 *
 * This example shows how to integrate the accomplishment emitter system
 * with a quest system to track quest-related accomplishments.
 */
class QuestSystemExample {
  constructor(accomplishmentManager) {
    this.registry = new AccomplishmentEmitterRegistry();
    this.accomplishmentManager = accomplishmentManager;
  }

  /**
   * Handle quest completion event
   *
   * @param {Object} player - The player who completed the quest
   * @param {Object} quest - The quest that was completed
   * @param {Object} questStats - Statistics about the quest completion
   */
  handleQuestCompleted(player, quest, questStats) {
    // Determine the appropriate preset based on quest type
    let presetName = "questCompleted";

    if (quest.isHidden) {
      presetName = "hiddenQuestDiscovered";
    } else if (quest.isTimeLimited) {
      presetName = "timeLimitedQuestCompleted";
    } else if (quest.difficulty === "legendary") {
      presetName = "legendaryQuestCompleted";
    } else if (quest.isPartOfChain && quest.isChainFinal) {
      presetName = "questChainCompleted";
    }

    // Create the quest accomplishment
    const accomplishmentData = this.registry.createFromPreset(
      "quest",
      presetName,
      {
        questId: quest.id,
        questName: quest.name,
        questCategory: quest.category,
        questDifficulty: quest.difficulty,
        questCompletionTime: questStats.completionTime,
        questRewardTier: quest.rewardTier,
        isQuestChainCompleted: quest.isPartOfChain && quest.isChainFinal,
        isHiddenQuest: quest.isHidden,
        isTimeLimitedQuest: quest.isTimeLimited,
      }
    );

    if (accomplishmentData) {
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    }

    // Check if this quest completion unlocks an area
    if (quest.unlocksArea) {
      const areaData = this.registry.createFromPreset(
        "exploration",
        "areaDiscovered",
        {
          areaId: quest.unlocksArea.id,
          areaName: quest.unlocksArea.name,
          areaType: quest.unlocksArea.type,
          areaSize: quest.unlocksArea.size,
          areaRarity: quest.unlocksArea.rarity,
          isSecretArea: quest.unlocksArea.isSecret,
          discoveryMethod: "quest",
        }
      );

      if (areaData) {
        this.accomplishmentManager.trackAccomplishment(areaData);
      }
    }
  }

  /**
   * Handle collection of a quest item
   *
   * @param {Object} player - The player who collected the item
   * @param {Object} item - The item that was collected
   * @param {Object} questContext - Context about the related quest
   */
  handleQuestItemCollected(player, item, questContext) {
    // Create an item collection accomplishment
    const accomplishmentData = this.registry.createFromPreset(
      "collection",
      "itemCollected",
      {
        collectionId: questContext.questId,
        collectionName: questContext.questName,
        itemId: item.id,
        itemName: item.name,
        itemRarity: item.rarity,
        isFirstTimeCollecting: !player.hasCollectedItem(item.id),
        collectionCategory: "quest",
        collectionProgress: questContext.progress,
        isCollectionComplete: questContext.isComplete,
        totalItemsInCollection: questContext.totalItems,
        collectedItemsInCollection: questContext.collectedItems,
      }
    );

    if (accomplishmentData) {
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    }

    // If the item is rare, also track it as a rare item collection
    if (
      item.rarity === "rare" ||
      item.rarity === "epic" ||
      item.rarity === "legendary"
    ) {
      const rareItemData = this.registry.createFromPreset(
        "collection",
        "rareItemCollected",
        {
          collectionId: "rare-items",
          collectionName: "Rare Items Collection",
          itemId: item.id,
          itemName: item.name,
          itemRarity: item.rarity,
          isFirstTimeCollecting: !player.hasCollectedItem(item.id),
          collectionCategory: "rare",
        }
      );

      if (rareItemData) {
        this.accomplishmentManager.trackAccomplishment(rareItemData);
      }
    }
  }
}

// Export the examples
module.exports = {
  CombatSystemExample,
  QuestSystemExample,
};
