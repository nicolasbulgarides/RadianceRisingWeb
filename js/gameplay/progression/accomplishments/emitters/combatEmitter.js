/**
 * Emitter for combat-related accomplishments.
 *
 * This class provides presets for common combat accomplishments such as
 * defeating enemies, completing battles, and achieving combat milestones.
 */
class CombatEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      enemyDefeated: {
        category: "combat",
        subCategory: "defeat",
        metaData: {
          nickName: "Enemy Defeated",
          description: "Player has defeated an enemy",
        },
        defaultData: {
          combatEventType: "defeat",
          combatOutcome: "victory",
          idsOfDefeatedEntities: [],
          idsOfVictorEntities: [],
          combatEventLocation: "",
          combatEventDifficultyTier: 1,
          combatEventRarityTier: "common",
          otherRelevantData: {},
        },
      },
      bossDefeated: {
        category: "combat",
        subCategory: "boss-defeat",
        metaData: {
          nickName: "Boss Defeated",
          description: "Player has defeated a boss enemy",
        },
        defaultData: {
          combatEventType: "boss-defeat",
          combatOutcome: "victory",
          idsOfDefeatedEntities: [],
          idsOfVictorEntities: [],
          combatEventLocation: "",
          combatEventDifficultyTier: 3,
          combatEventRarityTier: "rare",
          otherRelevantData: {},
        },
      },
      flawlessVictory: {
        category: "combat",
        subCategory: "flawless",
        metaData: {
          nickName: "Flawless Victory",
          description: "Player defeated enemies without taking damage",
        },
        defaultData: {
          combatEventType: "flawless",
          combatOutcome: "victory",
          idsOfDefeatedEntities: [],
          idsOfVictorEntities: [],
          combatEventLocation: "",
          combatEventDifficultyTier: 2,
          combatEventRarityTier: "uncommon",
          otherRelevantData: {
            damageTaken: 0,
          },
        },
      },
      combatMilestone: {
        category: "combat",
        subCategory: "milestone",
        metaData: {
          nickName: "Combat Milestone",
          description: "Player has reached a combat-related milestone",
        },
        defaultData: {
          combatEventType: "milestone",
          combatOutcome: "achievement",
          idsOfDefeatedEntities: [],
          idsOfVictorEntities: [],
          combatEventLocation: "",
          combatEventDifficultyTier: 1,
          combatEventRarityTier: "common",
          otherRelevantData: {
            milestoneType: "",
            milestoneValue: 0,
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
