/**
 * Primary manager class for handling all mojo-related operations for a player.
 * Coordinates mojo point adjustments, milestone evaluations, and catastrophe handling.
 */
class MojoManagerComposite {
  /**
   * Creates a new mojo manager instance for a specific player.
   * @param {Player} playerToManageMojo - The player whose mojo will be managed
   */
  constructor(playerToManageMojo) {
    this.currentMojoPoints = playerToManageMojo.currentMojoPoints;
    this.lifetimeMojoPoints = playerToManageMojo.lifetimeMojoPoints;
  }

  /**
   * Awards additional mojo points to the player.
   * @param {number} points - The number of mojo points to grant
   */
  grantExtraMojoPoints(points) {}

  /**
   * Reduces the player's mojo points, subject to catastrophe rules.
   * @param {number} points - The number of mojo points to subtract
   */
  subtractMojoPoints(points) {
    let mojoWillBePunished = MojoAuditor.evaluateIfMojoCatastropheIsWarranted();

    if (!mojoWillBePunished) {
      this.currentMojoPoints -= points;
    }
  }

  /**
   * Adjusts mojo points up or down after auditing the change.
   * Positive changes are treated as rewards, negative as penalties.
   * @param {number} points - The number of points to adjust (positive or negative)
   */
  adjustMojoPoints(points) {
    if (points > 0) {
      let mojoBoonApproved = MojoAuditor.auditPositiveMojoEvent(this, points);

      if (mojoBoonApproved) {
        this.grantExtraMojoPoints(points);
      }
    } else {
      let mojoBoonApproved = MojoAuditor.auditNegativeMojoEvent(this, points);

      if (mojoBoonApproved) {
        this.subtractMojoPoints(points);
      }
    }
  }

  /**
   * Resets the player's current mojo points to zero.
   * Only executes if a catastrophe is warranted based on player behavior.
   */
  clearCurrentMojoPoints() {
    let determinedToDeserveUltimateMojoPunishment =
      MojoAuditor.evaluateIfMojoCatastropheIsWarranted();

    if (determinedToDeserveUltimateMojoPunishment) {
      let mojoPointsSadlyLost = this.currentMojoPoints;
      this.currentMojoPoints = 0;
      playerToManageMojo.currentMojoPoints = 0;
      MojoUIManager.displayMojoCatastrophe(mojoPointsSadlyLost);
    }
  }

  /**
   * Checks if the player has achieved any mojo milestones.
   * Called periodically to evaluate player progress.
   */
  evaluateMojoMilestones() {}
}
