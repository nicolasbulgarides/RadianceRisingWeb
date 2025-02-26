/**
 * Example of how to use the accomplishment emitter system in a quest system.
 * This is a simplified example to demonstrate the pattern.
 */
class QuestSystemExample {
  /**
   * Creates a new quest system.
   *
   * @param {AccomplishmentEmitterRegistry} emitterRegistry - The emitter registry
   */
  constructor(emitterRegistry) {
    this.emitterRegistry = emitterRegistry;
    this.questEmitter = emitterRegistry.getEmitter("quest");
  }

  /**
   * Completes a quest for a player.
   *
   * @param {Player} player - The player completing the quest
   * @param {Quest} quest - The quest being completed
   */
  completeQuest(player, quest) {
    // Game logic for completing the quest
    quest.status = "completed";
    player.addCompletedQuest(quest.id);

    // Emit the quest completion accomplishment
    this.questEmitter.emit("questCompleted", {
      questId: quest.id,
      questName: quest.name,
      questDescription: quest.description,
      questLocation: quest.location,
      questRarityTier: quest.rarityTier,
      questDifficultyTier: quest.difficultyTier,
    });

    // Check if this completes a quest chain
    this.checkQuestChainCompletion(player, quest);
  }

  /**
   * Completes a step in a quest.
   *
   * @param {Player} player - The player completing the quest step
   * @param {Quest} quest - The quest containing the step
   * @param {QuestStep} step - The step being completed
   */
  completeQuestStep(player, quest, step) {
    // Game logic for completing the quest step
    step.status = "completed";
    quest.updateProgress();

    // Emit the quest step completion accomplishment
    this.questEmitter.emit("questStepCompleted", {
      questId: quest.id,
      questName: quest.name,
      questDescription: quest.description,
      questLocation: quest.location,
      questRarityTier: quest.rarityTier,
      questDifficultyTier: quest.difficultyTier,
    });
  }

  /**
   * Checks if completing a quest also completes a quest chain.
   *
   * @param {Player} player - The player completing the quest
   * @param {Quest} completedQuest - The quest that was just completed
   */
  checkQuestChainCompletion(player, completedQuest) {
    // Get the quest chain if this quest is part of one
    const questChain = this.getQuestChain(completedQuest.chainId);

    if (questChain && this.isQuestChainCompleted(player, questChain)) {
      // Emit the quest chain completion accomplishment
      this.questEmitter.emit("questChainCompleted", {
        questId: questChain.id,
        questName: questChain.name,
        questDescription: questChain.description,
        questLocation: questChain.primaryLocation,
        questRarityTier: questChain.rarityTier,
        questDifficultyTier: questChain.difficultyTier,
      });
    }
  }

  /**
   * Checks if a player has completed all quests in a chain.
   *
   * @param {Player} player - The player to check
   * @param {QuestChain} questChain - The quest chain to check
   * @returns {boolean} - True if all quests in the chain are completed
   */
  isQuestChainCompleted(player, questChain) {
    return questChain.questIds.every((questId) =>
      player.completedQuests.includes(questId)
    );
  }

  /**
   * Gets a quest chain by ID.
   *
   * @param {string} chainId - The ID of the quest chain
   * @returns {QuestChain|null} - The quest chain or null if not found
   */
  getQuestChain(chainId) {
    // Implementation would retrieve the quest chain from a data store
    return null; // Placeholder
  }

  /**
   * Discovers a rare quest.
   *
   * @param {Player} player - The player discovering the quest
   * @param {Quest} quest - The rare quest being discovered
   */
  discoverRareQuest(player, quest) {
    // Game logic for discovering a rare quest
    player.addDiscoveredQuest(quest.id);

    // Emit a special accomplishment for discovering a rare quest
    // This could use a different preset or a custom one
    this.questEmitter.emit("rareQuestCompleted", {
      questId: quest.id,
      questName: quest.name,
      questDescription: quest.description,
      questLocation: quest.location,
      questRarityTier: quest.rarityTier,
      questDifficultyTier: quest.difficultyTier,
    });
  }
}

// Example usage:
// const emitterRegistry = AccomplishmentEmitterRegistry.getInstance(progressionManager);
// const questSystem = new QuestSystemExample(emitterRegistry);
//
// // Later, when a quest is completed:
// questSystem.completeQuest(player, quest);
