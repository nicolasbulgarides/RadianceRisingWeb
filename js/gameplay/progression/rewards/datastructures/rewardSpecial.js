/**
 * RewardSpecial manages special gameplay-enhancing rewards and power-ups.
 * This class handles non-standard rewards that affect gameplay mechanics,
 * social interactions, and special features like hints and boosts.
 */
class RewardSpecial {
  /**
   * Creates a new RewardSpecial instance.
   * @param {number} hintPoints - Number of hint points to be awarded
   * @param {number} extraLives - Number of additional lives to be granted
   * @param {number} soloUseTokens - Number of single-player tokens to be awarded
   * @param {number} socialGiftTokens - Number of tokens that can be gifted to other players
   * @param {number} mojoBoostPoints - Amount of mojo boost points to be awarded
   * @param {Object} mojoBubble - Special mojo bubble reward object
   */
  constructor(
    hintPoints,
    extraLives,
    soloUseTokens,
    socialGiftTokens,
    mojoBoostPoints,
    mojoBubble
  ) {
    this.hintPoints = hintPoints;
    this.extraLives = extraLives;
    this.soloUseTokens = soloUseTokens;
    this.socialGiftTokens = socialGiftTokens;
    this.mojoBoostPoints = mojoBoostPoints;
    this.mojoBubble = mojoBubble;
  }
}
