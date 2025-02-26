/**
 * Data structure representing all unlockable rewards in the game.
 * Tracks various types of unlocks including items, levels, worlds, and special content.
 */
class RewardUnlocks {
  /**
   * Creates a new reward unlocks instance with specified unlock states.
   * @param {boolean} item - Whether an item has been unlocked
   * @param {boolean} level - Whether a level has been unlocked
   * @param {boolean} world - Whether a world has been unlocked
   * @param {boolean} spell - Whether a spell has been unlocked
   * @param {boolean} artifact - Whether an artifact has been unlocked
   * @param {boolean} song - Whether a song has been unlocked
   * @param {boolean} lore - Whether a lore piece has been unlocked
   */
  constructor(item, level, world, spell, artifact, song, lore) {
    this.rewardItemUnlock = item;
    this.rewardLevelUnlock = level;
    this.rewardWorldUnlock = world;
    this.rewardSpellUnlock = spell;
    this.rewardArtifactUnlock = artifact;
    this.rewardSongUnlock = song;
    this.rewardLoreUnlock = lore;
  }
}
