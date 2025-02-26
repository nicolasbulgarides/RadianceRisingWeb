/**
 * Primary manager class for handling all mojo-related operations for a player.
 * Coordinates mojo point adjustments, milestone evaluations, and reward enhancements.
 * Mojo is a special currency that allows players to enhance their rewards based on
 * their gameplay achievements and streaks.
 *
 * // to do - refine / carefully review and balance
 *  code gen went bananas here wow
 */
class MojoManagerComposite {
  /**
   * Creates a new mojo manager instance for a specific player.
   * @param {Player} playerToManageMojo - The player whose mojo will be managed
   */
  constructor(playerToManageMojo) {
    this.playerToManageMojo = playerToManageMojo;
    this.currentMojoPoints = playerToManageMojo.currentMojoPoints;
    this.lifetimeMojoPoints = playerToManageMojo.lifetimeMojoPoints;
    this.lastMojoUpdateTime = Date.now();
    this.mojoStreakLevel = playerToManageMojo.mojoStreakLevel || 0;
  }

  // ===== MOJO POINT MANAGEMENT =====

  /**
   * Awards additional mojo points to the player with potential bonuses based on streaks.
   * @param {number} points - The number of mojo points to grant
   */
  grantExtraMojoPoints(points) {
    // Apply streak bonus if applicable
    const bonusMultiplier = this.calculateStreakBonusMultiplier();
    const adjustedPoints = Math.round(points * bonusMultiplier);

    // Update points
    this.currentMojoPoints += adjustedPoints;
    this.lifetimeMojoPoints += adjustedPoints;

    // Sync with player object
    this.playerToManageMojo.currentMojoPoints = this.currentMojoPoints;
    this.playerToManageMojo.lifetimeMojoPoints = this.lifetimeMojoPoints;

    // Check for milestones after adding points
    this.evaluateMojoMilestones();

    // Return the actual points granted (for UI feedback)
    return {
      basePoints: points,
      bonusMultiplier: bonusMultiplier,
      totalPointsGranted: adjustedPoints,
    };
  }

  /**
   * Calculates bonus multiplier based on player's streak level.
   * @returns {number} The multiplier to apply to mojo point gains
   */
  calculateStreakBonusMultiplier() {
    // Base multiplier is 1.0
    let multiplier = 1.0;

    // Add 0.1 for each streak level, up to a maximum of 2.0
    multiplier += Math.min(this.mojoStreakLevel * 0.1, 1.0);

    // Premium players get an additional bonus
    if (this.playerToManageMojo.isPremium) {
      multiplier += 0.2;
    }

    return multiplier;
  }

  /**
   * Reduces the player's mojo points, subject to catastrophe rules.
   * @param {number} points - The number of mojo points to subtract
   */
  subtractMojoPoints(points) {
    let mojoWillBePunished = MojoAuditor.evaluateIfMojoCatastropheIsWarranted();

    if (!mojoWillBePunished) {
      // Ensure we don't go below zero
      this.currentMojoPoints = Math.max(0, this.currentMojoPoints - points);
      this.playerToManageMojo.currentMojoPoints = this.currentMojoPoints;

      // Reset streak if points are reduced significantly
      if (points > 50) {
        this.mojoStreakLevel = Math.max(0, this.mojoStreakLevel - 1);
        this.playerToManageMojo.mojoStreakLevel = this.mojoStreakLevel;
      }
    }
  }

  /**
   * Adjusts mojo points up or down after auditing the change.
   * Positive changes are treated as rewards, negative as penalties.
   * @param {number} points - The number of points to adjust (positive or negative)
   * @returns {Object|null} Result of the adjustment or null if not approved
   */
  adjustMojoPoints(points) {
    if (points > 0) {
      let mojoBoonApproved = MojoAuditor.auditPositiveMojoEvent(this, points);

      if (mojoBoonApproved) {
        return this.grantExtraMojoPoints(points);
      }
    } else if (points < 0) {
      let mojoBoonApproved = MojoAuditor.auditNegativeMojoEvent(
        this,
        Math.abs(points)
      );

      if (mojoBoonApproved) {
        this.subtractMojoPoints(Math.abs(points));
        return { pointsReduced: Math.abs(points) };
      }
    }

    return null;
  }

  /**
   * Resets the player's current mojo points to zero.
   * Only executes if a catastrophe is warranted based on player behavior.
   * @returns {boolean} Whether the catastrophe was applied
   */
  clearCurrentMojoPoints() {
    let determinedToDeserveUltimateMojoPunishment =
      MojoAuditor.evaluateIfMojoCatastropheIsWarranted();

    if (determinedToDeserveUltimateMojoPunishment) {
      let mojoPointsSadlyLost = this.currentMojoPoints;
      this.currentMojoPoints = 0;
      this.playerToManageMojo.currentMojoPoints = this.currentMojoPoints;
      this.mojoStreakLevel = 0;
      this.playerToManageMojo.mojoStreakLevel = 0;

      MojoUIManager.displayMojoCatastrophe(mojoPointsSadlyLost);
      return true;
    }

    return false;
  }

  // ===== MILESTONE EVALUATION =====

  /**
   * Checks if the player has achieved any mojo milestones.
   * Called periodically to evaluate player progress.
   * @returns {Array} List of milestones achieved in this evaluation
   */
  evaluateMojoMilestones() {
    const achievedMilestones = [];

    // Check lifetime milestones
    if (
      this.lifetimeMojoPoints >= 10000 &&
      !this.playerToManageMojo.hasAchievedMilestone("mojomilestone-radiantray")
    ) {
      achievedMilestones.push("mojomilestone-radiantray");
      this.playerToManageMojo.addAchievedMilestone("mojomilestone-radiantray");
      MojoUIManager.displayMojoMilestone(
        "mojomilestone-radiantray",
        this.lifetimeMojoPoints
      );
    } else if (
      this.lifetimeMojoPoints >= 5000 &&
      !this.playerToManageMojo.hasAchievedMilestone("mojomilestone-epic")
    ) {
      achievedMilestones.push("mojomilestone-epic");
      this.playerToManageMojo.addAchievedMilestone("mojomilestone-epic");
      MojoUIManager.displayMojoMilestone(
        "mojomilestone-epic",
        this.lifetimeMojoPoints
      );
    } else if (
      this.lifetimeMojoPoints >= 2000 &&
      !this.playerToManageMojo.hasAchievedMilestone("mojomilestone-great")
    ) {
      achievedMilestones.push("mojomilestone-great");
      this.playerToManageMojo.addAchievedMilestone("mojomilestone-great");
      MojoUIManager.displayMojoMilestone(
        "mojomilestone-great",
        this.lifetimeMojoPoints
      );
    } else if (
      this.lifetimeMojoPoints >= 1000 &&
      !this.playerToManageMojo.hasAchievedMilestone("mojomilestone-middle")
    ) {
      achievedMilestones.push("mojomilestone-middle");
      this.playerToManageMojo.addAchievedMilestone("mojomilestone-middle");
      MojoUIManager.displayMojoMilestone(
        "mojomilestone-middle",
        this.lifetimeMojoPoints
      );
    } else if (
      this.lifetimeMojoPoints >= 500 &&
      !this.playerToManageMojo.hasAchievedMilestone("mojomilestone-minor")
    ) {
      achievedMilestones.push("mojomilestone-minor");
      this.playerToManageMojo.addAchievedMilestone("mojomilestone-minor");
      MojoUIManager.displayMojoMilestone(
        "mojomilestone-minor",
        this.lifetimeMojoPoints
      );
    }

    // Check streak milestones
    if (
      this.mojoStreakLevel >= 10 &&
      !this.playerToManageMojo.hasAchievedMilestone("mojostreak-master")
    ) {
      achievedMilestones.push("mojostreak-master");
      this.playerToManageMojo.addAchievedMilestone("mojostreak-master");
      MojoUIManager.displayMojoMilestone(
        "mojostreak-master",
        this.mojoStreakLevel
      );
    }

    return achievedMilestones;
  }

  // ===== ENHANCEMENT TIER DETERMINATION =====

  /**
   * Determines the appropriate enhancement tier based on player's mojo level.
   * @returns {string} The enhancement tier identifier
   */
  determineMojoEnhancementTier() {
    if (this.currentMojoPoints >= 10000) {
      return "radiantraysdivine";
    } else if (this.currentMojoPoints >= 5000) {
      return "legendary";
    } else if (this.currentMojoPoints >= 2500) {
      return "divine";
    } else if (this.currentMojoPoints >= 1500) {
      return "epic";
    } else if (this.currentMojoPoints >= 1000) {
      return "incredible";
    } else if (this.currentMojoPoints >= 750) {
      return "advanced";
    } else if (this.currentMojoPoints >= 500) {
      return "major";
    } else if (this.currentMojoPoints >= 250) {
      return "basic";
    } else if (this.currentMojoPoints >= 100) {
      return "minor";
    } else {
      return "none";
    }
  }

  // ===== REWARD ENHANCEMENT METHODS =====

  /**
   * Applies minor mojo enhancement to a reward bundle.
   * Increases basic rewards by 10%.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyMinorMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Enhance currency rewards by 10%
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 1.1;
      }

      // Enhance experience rewards by 5%
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 1.05;
      }
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "minor";
    return rewardBundle;
  }

  /**
   * Applies basic mojo enhancement to a reward bundle.
   * Increases basic rewards by 20%.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyBasicMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Enhance currency rewards by 20%
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 1.2;
      }

      // Enhance experience rewards by 10%
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 1.1;
      }
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "basic";
    return rewardBundle;
  }

  /**
   * Applies major mojo enhancement to a reward bundle.
   * Increases basic rewards by 30% and adds a small chance for bonus items.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyMajorMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Enhance currency rewards by 30%
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 1.3;
      }

      // Enhance experience rewards by 15%
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 1.15;
      }
    }

    // 10% chance to add a bonus common item
    if (Math.random() < 0.1 && rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusCommonItems =
        (rewardBundle.rewardUnlocks.bonusCommonItems || 0) + 1;
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "major";
    return rewardBundle;
  }

  /**
   * Applies advanced mojo enhancement to a reward bundle.
   * Increases basic rewards by 40% and adds a moderate chance for bonus items.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyAdvancedMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Enhance currency rewards by 40%
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 1.4;
      }

      // Enhance experience rewards by 20%
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 1.2;
      }
    }

    // 15% chance to add a bonus uncommon item
    if (Math.random() < 0.15 && rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusUncommonItems =
        (rewardBundle.rewardUnlocks.bonusUncommonItems || 0) + 1;
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "advanced";
    return rewardBundle;
  }

  /**
   * Applies incredible mojo enhancement to a reward bundle.
   * Increases basic rewards by 50% and adds a good chance for bonus items.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyIncredibleMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Enhance currency rewards by 50%
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 1.5;
      }

      // Enhance experience rewards by 25%
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 1.25;
      }
    }

    // 20% chance to add a bonus rare item
    if (Math.random() < 0.2 && rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusRareItems =
        (rewardBundle.rewardUnlocks.bonusRareItems || 0) + 1;
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "incredible";
    return rewardBundle;
  }

  /**
   * Applies divine mojo enhancement to a reward bundle.
   * Increases basic rewards by 75% and guarantees bonus items.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyDivineMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Enhance currency rewards by 75%
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 1.75;
      }

      // Enhance experience rewards by 35%
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 1.35;
      }
    }

    // Guaranteed bonus rare item
    if (rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusRareItems =
        (rewardBundle.rewardUnlocks.bonusRareItems || 0) + 1;
    }

    // 10% chance for an epic item
    if (Math.random() < 0.1 && rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusEpicItems =
        (rewardBundle.rewardUnlocks.bonusEpicItems || 0) + 1;
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "divine";
    return rewardBundle;
  }

  /**
   * Applies epic mojo enhancement to a reward bundle.
   * Doubles basic rewards and guarantees multiple bonus items.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyEpicMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Double currency rewards
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 2.0;
      }

      // Enhance experience rewards by 50%
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 1.5;
      }
    }

    // Guaranteed bonus epic item
    if (rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusEpicItems =
        (rewardBundle.rewardUnlocks.bonusEpicItems || 0) + 1;
    }

    // 20% chance for a legendary item
    if (Math.random() < 0.2 && rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusLegendaryItems =
        (rewardBundle.rewardUnlocks.bonusLegendaryItems || 0) + 1;
    }

    // Add special visual effects to rewards
    if (rewardBundle.rewardSpecial) {
      rewardBundle.rewardSpecial.visualEffects = "epic-glow";
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "epic";
    return rewardBundle;
  }

  /**
   * Applies legendary mojo enhancement to a reward bundle.
   * Triples basic rewards and guarantees legendary items.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyLegendaryMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Triple currency rewards
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 3.0;
      }

      // Double experience rewards
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 2.0;
      }
    }

    // Guaranteed legendary item
    if (rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusLegendaryItems =
        (rewardBundle.rewardUnlocks.bonusLegendaryItems || 0) + 1;
    }

    // Add special visual effects to rewards
    if (rewardBundle.rewardSpecial) {
      rewardBundle.rewardSpecial.visualEffects = "legendary-aura";
      rewardBundle.rewardSpecial.soundEffects = "legendary-fanfare";
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "legendary";
    return rewardBundle;
  }

  /**
   * Applies the ultimate radiant rays divine mojo enhancement to a reward bundle.
   * Quadruples basic rewards and guarantees multiple legendary items with special effects.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to enhance
   * @returns {RewardBundleComposite} The enhanced reward bundle
   */
  applyRadiantRaysDivineMojoEnhancement(rewardBundle) {
    if (rewardBundle.rewardBasic) {
      // Quadruple currency rewards
      if (rewardBundle.rewardBasic.currency) {
        rewardBundle.rewardBasic.currency *= 4.0;
      }

      // Triple experience rewards
      if (rewardBundle.rewardBasic.experience) {
        rewardBundle.rewardBasic.experience *= 3.0;
      }
    }

    // Guaranteed multiple legendary items
    if (rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusLegendaryItems =
        (rewardBundle.rewardUnlocks.bonusLegendaryItems || 0) + 2;
    }

    // Chance for mythic item (ultra rare)
    if (Math.random() < 0.5 && rewardBundle.rewardUnlocks) {
      rewardBundle.rewardUnlocks.bonusMythicItems =
        (rewardBundle.rewardUnlocks.bonusMythicItems || 0) + 1;
    }

    // Add special visual effects to rewards
    if (rewardBundle.rewardSpecial) {
      rewardBundle.rewardSpecial.visualEffects = "radiant-rays";
      rewardBundle.rewardSpecial.soundEffects = "divine-chorus";
      rewardBundle.rewardSpecial.specialAnimation = "treasure-explosion";
    }

    // Add enhancement marker for UI
    rewardBundle.enhancementTier = "radiantraysdivine";
    return rewardBundle;
  }

  /**
   * Subtracts mojo points after a successful enhancement.
   * The cost varies based on the enhancement tier.
   */
  subtractMojoPointsDueToSuccessfulEnhancement() {
    let mojoPointsReduction = this.determineMojoBlessingPointsReduction();
    this.subtractMojoPoints(mojoPointsReduction);
  }

  /**
   * Determines how many mojo points to reduce after a blessing.
   * Cost varies based on enhancement tier and player status.
   * @returns {number} The number of points to reduce
   */
  determineMojoBlessingPointsReduction() {
    // Get the enhancement tier
    const enhancementTier = this.determineMojoEnhancementTier();

    // Base costs for each tier
    const tierCosts = {
      minor: 100,
      basic: 250,
      major: 500,
      advanced: 750,
      incredible: 1000,
      epic: 1500,
      divine: 2500,
      legendary: 5000,
      radiantraysdivine: 10000,
    };

    // Get base cost for the current tier
    const baseCost = tierCosts[enhancementTier] || 0;

    // Premium players get a discount
    if (this.playerToManageMojo.isPremium) {
      return Math.floor(baseCost * 0.8); // 20% discount
    }

    return baseCost;
  }

  /**
   * Evaluates if a reward should be enhanced by mojo.
   * @param {RewardBundleComposite} rewardBundle - The reward bundle to potentially enhance
   * @returns {RewardBundleComposite} The potentially enhanced reward bundle
   */
  enhanceRewardWithMojo(rewardBundle) {
    // Check if player has sufficient mojo for enhancement
    if (this.currentMojoPoints >= 100) {
      // Determine enhancement tier based on mojo level
      const enhancementTier = this.determineMojoEnhancementTier();

      // If no valid enhancement tier, return unmodified bundle
      if (enhancementTier === "none") {
        return rewardBundle;
      }

      // Apply enhancements based on tier
      switch (enhancementTier) {
        case "minor":
          rewardBundle = this.applyMinorMojoEnhancement(rewardBundle);
          break;
        case "basic":
          rewardBundle = this.applyBasicMojoEnhancement(rewardBundle);
          break;
        case "major":
          rewardBundle = this.applyMajorMojoEnhancement(rewardBundle);
          break;
        case "advanced":
          rewardBundle = this.applyAdvancedMojoEnhancement(rewardBundle);
          break;
        case "incredible":
          rewardBundle = this.applyIncredibleMojoEnhancement(rewardBundle);
          break;
        case "epic":
          rewardBundle = this.applyEpicMojoEnhancement(rewardBundle);
          break;
        case "divine":
          rewardBundle = this.applyDivineMojoEnhancement(rewardBundle);
          break;
        case "legendary":
          rewardBundle = this.applyLegendaryMojoEnhancement(rewardBundle);
          break;
        case "radiantraysdivine":
          rewardBundle =
            this.applyRadiantRaysDivineMojoEnhancement(rewardBundle);
          break;
      }

      // Consume some mojo points for the enhancement
      this.subtractMojoPointsDueToSuccessfulEnhancement();

      // Increment streak level after successful enhancement
      this.mojoStreakLevel += 1;
      this.playerToManageMojo.mojoStreakLevel = this.mojoStreakLevel;
    }

    return rewardBundle;
  }
}
