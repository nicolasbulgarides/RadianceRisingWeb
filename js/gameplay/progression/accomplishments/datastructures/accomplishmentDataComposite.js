/**
 * Main composite data structure for tracking all accomplishment types.
 *
 * This class aggregates all specialized accomplishment data structures into a single
 * comprehensive object. The flexible architecture supports a wide variety of game
 * events and accomplishment types, allowing for complex interactions and reward chains.
 *
 * Categories include:
 * - Basic milestones (numerical achievements)
 * - Area completions
 * - Quests
 * - Achievements
 * - Events
 * - Learning abilities/spells/lore
 * - Object acquisition
 * - Combat outcomes
 * - Competitive results
 * - Status effects
 * - Social interactions
 * - Pet-related events
 * - Account milestones
 * - Usage statistics
 * - Minigame accomplishments
 * - Technical data
 * - Crafting activities
 * - Economic transactions
 * - Exploration discoveries
 * - Collection completions
 * - Progression advancements
 */
class AccomplishmentDataComposite {
  /**
   * Creates a new composite accomplishment data instance
   * @param {AccomplishmentHeader} header - Basic identification information
   * @param {AccomplishmentBasicMilestoneData} basicMilestoneData - Numerical milestone data
   * @param {AccomplishmentAreaData} areaData - Area/level completion data
   * @param {AccomplishmentLearnedData} learnedData - Ability/spell/lore learning data
   * @param {AccomplishmentQuestData} questData - Quest progress/completion data
   * @param {AccomplishmentAchievementData} achievementData - Achievement data
   * @param {AccomplishmentEventData} eventData - Event participation/completion data
   * @param {AccomplishmentAcquiredObjectData} acquiredObjectData - Item acquisition data
   * @param {AccomplishmentCombatData} combatData - Combat outcome data
   * @param {AccomplishmentCompetitiveData} competitiveData - PvP competition data
   * @param {AccomplishmentStatusData} statusData - Status effect data
   * @param {AccomplishmentSocialData} socialData - Social interaction data
   * @param {AccomplishmentPetData} petData - Pet-related event data
   * @param {AccomplishmentAccountData} accountData - Account milestone data
   * @param {AccomplishmentUsageData} usageData - Usage statistics data
   * @param {AccomplishmentMinigameData} minigameData - Minigame accomplishment data
   * @param {AccomplishmentTechnicalData} technicalData - Technical/debugging data
   * @param {AccomplishmentCraftingData} craftingData - Crafting activity data
   * @param {AccomplishmentEconomyData} economyData - Economic transaction data
   * @param {AccomplishmentExplorationData} explorationData - Exploration discovery data
   * @param {AccomplishmentCollectionData} collectionData - Collection completion data
   * @param {AccomplishmentProgressionData} progressionData - Progression advancement data
   */
  constructor(
    header,
    basicMilestoneData,
    areaData,
    learnedData,
    questData,
    achievementData,
    eventData,
    acquiredObjectData,
    combatData,
    competitiveData,
    statusData,
    socialData,
    petData,
    accountData,
    usageData,
    minigameData,
    technicalData,
    craftingData,
    economyData,
    explorationData,
    collectionData,
    progressionData
  ) {
    this.accomplishmentHeader = header;
    this.accomplishmentBasicMilestoneData = basicMilestoneData;
    this.accomplishmentAreaData = areaData;
    this.accomplishmentEventData = eventData;
    this.accomplishmentQuestData = questData;
    this.accomplishmentAchievementData = achievementData;
    this.accomplishmentLearnedData = learnedData;
    this.accomplishmentAcquiredObjectData = acquiredObjectData;
    this.accomplishmentCombatData = combatData;
    this.accomplishmentCompetitiveData = competitiveData;
    this.accomplishmentStatusData = statusData;
    this.accomplishmentSocialData = socialData;
    this.accomplishmentPetData = petData;
    this.accomplishmentAccountData = accountData;
    this.accomplishmentMinigameData = minigameData;
    this.accomplishmentUsageData = usageData;
    this.accomplishmentTechnicalData = technicalData;
    this.accomplishmentCraftingData = craftingData;
    this.accomplishmentEconomyData = economyData;
    this.accomplishmentExplorationData = explorationData;
    this.accomplishmentCollectionData = collectionData;
    this.accomplishmentProgressionData = progressionData;
  }
}
