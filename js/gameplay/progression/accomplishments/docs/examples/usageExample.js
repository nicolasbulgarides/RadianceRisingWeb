/**
 * This file demonstrates how to use the Accomplishment System in various game scenarios.
 * It shows examples of creating and tracking accomplishments using different emitters.
 */

/**
 * Example class that demonstrates how to use the Accomplishment System
 */
class AccomplishmentSystemExample {
  constructor() {
    // Initialize the registry
    this.registry = new AccomplishmentEmitterRegistry();
    this.registry.registerDefaultEmitters();

    // This would typically be a reference to your game's accomplishment manager
    this.accomplishmentManager = {
      trackAccomplishment: (accomplishment) => {
        console.log("Tracking accomplishment:", accomplishment);
        // In a real implementation, this would save the accomplishment to the player's record
        return true;
      },
    };
  }

  /**
   * Example of tracking a combat accomplishment
   * @param {Object} playerData - Data about the player
   * @param {Object} enemyData - Data about the defeated enemy
   */
  trackCombatAccomplishment(playerData, enemyData) {
    console.log("Tracking combat accomplishment...");

    // Create an accomplishment using the combat emitter
    const accomplishmentData = this.registry.createFromPreset(
      "combat",
      "enemyDefeated",
      {
        idsOfDefeatedEntities: [enemyData.id],
        idsOfVictorEntities: [playerData.id],
        combatEventLocation: playerData.currentLocation,
        combatDifficulty: enemyData.difficulty,
        combatDuration: 120, // 2 minutes
        combatRelevantValue: enemyData.level,
      }
    );

    // Validate the accomplishment data
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(accomplishmentData);

    if (isValid) {
      // Track the accomplishment
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    } else {
      console.error("Invalid accomplishment data:", errors);
    }
  }

  /**
   * Example of tracking an exploration accomplishment
   * @param {Object} playerData - Data about the player
   * @param {Object} areaData - Data about the discovered area
   */
  trackExplorationAccomplishment(playerData, areaData) {
    console.log("Tracking exploration accomplishment...");

    // Create an accomplishment using the exploration emitter
    const accomplishmentData = this.registry.createFromPreset(
      "exploration",
      "areaDiscovered",
      {
        explorationAreaId: areaData.id,
        explorationAreaName: areaData.name,
        explorationAreaType: areaData.type,
        explorationTimestamp: Date.now(),
        explorationPlayerLevel: playerData.level,
      }
    );

    // Validate the accomplishment data
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(accomplishmentData);

    if (isValid) {
      // Track the accomplishment
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    } else {
      console.error("Invalid accomplishment data:", errors);
    }
  }

  /**
   * Example of tracking a quest accomplishment
   * @param {Object} playerData - Data about the player
   * @param {Object} questData - Data about the completed quest
   */
  trackQuestAccomplishment(playerData, questData) {
    console.log("Tracking quest accomplishment...");

    // Create an accomplishment using the quest emitter
    const accomplishmentData = this.registry.createFromPreset(
      "quest",
      "questCompleted",
      {
        questId: questData.id,
        questName: questData.name,
        questCategory: questData.category,
        questDifficulty: questData.difficulty,
        questCompletionTime: questData.completionTime,
        questRewards: questData.rewards,
      }
    );

    // Validate the accomplishment data
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(accomplishmentData);

    if (isValid) {
      // Track the accomplishment
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    } else {
      console.error("Invalid accomplishment data:", errors);
    }
  }

  /**
   * Example of tracking a crafting accomplishment
   * @param {Object} playerData - Data about the player
   * @param {Object} itemData - Data about the crafted item
   */
  trackCraftingAccomplishment(playerData, itemData) {
    console.log("Tracking crafting accomplishment...");

    // Create an accomplishment using the crafting emitter
    const accomplishmentData = this.registry.createFromPreset(
      "crafting",
      "itemCrafted",
      {
        craftedItemId: itemData.id,
        craftedItemName: itemData.name,
        craftedItemRarity: itemData.rarity,
        craftingSkillLevel: playerData.craftingSkill,
        materialsUsed: itemData.materials,
        craftingLocation: playerData.currentLocation,
      }
    );

    // Validate the accomplishment data
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(accomplishmentData);

    if (isValid) {
      // Track the accomplishment
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    } else {
      console.error("Invalid accomplishment data:", errors);
    }
  }

  /**
   * Example of tracking a collection accomplishment
   * @param {Object} playerData - Data about the player
   * @param {Object} collectionData - Data about the completed collection
   */
  trackCollectionAccomplishment(playerData, collectionData) {
    console.log("Tracking collection accomplishment...");

    // Create an accomplishment using the collection emitter
    const accomplishmentData = this.registry.createFromPreset(
      "collection",
      "setCompleted",
      {
        collectionId: collectionData.id,
        collectionName: collectionData.name,
        collectionCategory: collectionData.category,
        collectionSize: collectionData.items.length,
        collectionRarity: collectionData.rarity,
        collectionCompletionTime: Date.now(),
      }
    );

    // Validate the accomplishment data
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(accomplishmentData);

    if (isValid) {
      // Track the accomplishment
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    } else {
      console.error("Invalid accomplishment data:", errors);
    }
  }

  /**
   * Example of tracking a progression accomplishment
   * @param {Object} playerData - Data about the player
   * @param {Object} skillData - Data about the skill that leveled up
   */
  trackProgressionAccomplishment(playerData, skillData) {
    console.log("Tracking progression accomplishment...");

    // Create an accomplishment using the progression emitter
    const accomplishmentData = this.registry.createFromPreset(
      "progression",
      "skillLevelUp",
      {
        progressionCategory: "skill",
        progressionSubCategory: skillData.category,
        progressionName: skillData.name,
        progressionLevel: skillData.level,
        progressionPreviousLevel: skillData.level - 1,
        progressionMaxLevel: skillData.maxLevel,
        progressionTimestamp: Date.now(),
      }
    );

    // Validate the accomplishment data
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(accomplishmentData);

    if (isValid) {
      // Track the accomplishment
      this.accomplishmentManager.trackAccomplishment(accomplishmentData);
    } else {
      console.error("Invalid accomplishment data:", errors);
    }
  }

  /**
   * Run all examples with sample data
   */
  runAllExamples() {
    // Sample player data
    const playerData = {
      id: "player-123",
      name: "HeroPlayer",
      level: 25,
      craftingSkill: 75,
      currentLocation: "forest-clearing",
    };

    // Sample enemy data
    const enemyData = {
      id: "enemy-456",
      name: "Forest Troll",
      level: 20,
      difficulty: "elite",
    };

    // Sample area data
    const areaData = {
      id: "area-789",
      name: "Hidden Grotto",
      type: "secret",
      difficulty: "medium",
    };

    // Sample quest data
    const questData = {
      id: "quest-101",
      name: "The Lost Artifact",
      category: "main",
      difficulty: "hard",
      completionTime: 3600, // 1 hour
      rewards: ["gold-500", "exp-1000", "item-rare-amulet"],
    };

    // Sample item data
    const itemData = {
      id: "item-202",
      name: "Enchanted Sword",
      rarity: "rare",
      materials: ["iron-ingot", "magic-essence", "rare-gem"],
      quality: 85,
    };

    // Sample collection data
    const collectionData = {
      id: "collection-303",
      name: "Ancient Runes",
      category: "lore",
      items: ["rune-1", "rune-2", "rune-3", "rune-4", "rune-5"],
      rarity: "legendary",
    };

    // Sample skill data
    const skillData = {
      id: "skill-404",
      name: "Archery",
      category: "combat",
      level: 50,
      maxLevel: 100,
    };

    // Run all examples
    this.trackCombatAccomplishment(playerData, enemyData);
    this.trackExplorationAccomplishment(playerData, areaData);
    this.trackQuestAccomplishment(playerData, questData);
    this.trackCraftingAccomplishment(playerData, itemData);
    this.trackCollectionAccomplishment(playerData, collectionData);
    this.trackProgressionAccomplishment(playerData, skillData);
  }
}

// Example usage
const example = new AccomplishmentSystemExample();
example.runAllExamples();

export { AccomplishmentSystemExample };
