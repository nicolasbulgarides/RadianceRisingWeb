/**
 * UsageEmitter
 *
 * Specialized emitter for tracking and emitting usage-related accomplishments.
 * Monitors player interactions with items, abilities, and features to recognize
 * accomplishments related to frequency, efficiency, or mastery of usage.
 *
 * This emitter processes accomplishmentUsageData objects and triggers appropriate
 * accomplishment events when usage thresholds or patterns are detected.
 *
 * @extends AccomplishmentEmitterBase
 */
class UsageEmitter extends AccomplishmentEmitterBase {
  /**
   * Creates a new UsageEmitter instance
   * @param {Object} config - Configuration options for this emitter
   */
  constructor(config = {}) {
    super(config);

    // Initialize usage tracking maps
    this.itemUsageMap = new Map();
    this.abilityUsageMap = new Map();
    this.featureUsageMap = new Map();
    this.sessionUsageMap = new Map();

    // Configure thresholds from config or use defaults
    this.thresholds = {
      itemUsage: config.itemUsageThreshold || 10,
      abilityUsage: config.abilityUsageThreshold || 5,
      featureUsage: config.featureUsageThreshold || 3,
      sessionUsage: config.sessionUsageThreshold || 1,
    };

    // Register event listeners
    this.registerEventListeners();
  }

  /**
   * Registers all event listeners needed for tracking usage
   * @private
   */
  registerEventListeners() {
    // Listen for item usage events
    this.eventBus.subscribe("item.used", this.handleItemUsage.bind(this));

    // Listen for ability usage events
    this.eventBus.subscribe("ability.used", this.handleAbilityUsage.bind(this));

    // Listen for feature interaction events
    this.eventBus.subscribe(
      "feature.interaction",
      this.handleFeatureInteraction.bind(this)
    );

    // Listen for session events
    this.eventBus.subscribe(
      "session.start",
      this.handleSessionStart.bind(this)
    );
    this.eventBus.subscribe("session.end", this.handleSessionEnd.bind(this));
  }

  /**
   * Handles item usage events
   * @param {Object} data - Data about the item usage
   * @private
   */
  handleItemUsage(data) {
    const { itemId, itemType, context } = data;

    // Update usage count for this item
    const key = `item_${itemId}`;
    const currentCount = this.itemUsageMap.get(key) || 0;
    this.itemUsageMap.set(key, currentCount + 1);

    // Check if we've reached any thresholds
    this.checkItemUsageThresholds(itemId, itemType, currentCount + 1, context);

    // Log the usage for debugging
    this.logger.debug(`Item ${itemId} used. New count: ${currentCount + 1}`);
  }

  /**
   * Handles ability usage events
   * @param {Object} data - Data about the ability usage
   * @private
   */
  handleAbilityUsage(data) {
    const { abilityId, abilityType, context } = data;

    // Update usage count for this ability
    const key = `ability_${abilityId}`;
    const currentCount = this.abilityUsageMap.get(key) || 0;
    this.abilityUsageMap.set(key, currentCount + 1);

    // Check if we've reached any thresholds
    this.checkAbilityUsageThresholds(
      abilityId,
      abilityType,
      currentCount + 1,
      context
    );

    // Log the usage for debugging
    this.logger.debug(
      `Ability ${abilityId} used. New count: ${currentCount + 1}`
    );
  }

  /**
   * Handles feature interaction events
   * @param {Object} data - Data about the feature interaction
   * @private
   */
  handleFeatureInteraction(data) {
    const { featureId, featureType, interactionType } = data;

    // Update usage count for this feature
    const key = `feature_${featureId}_${interactionType}`;
    const currentCount = this.featureUsageMap.get(key) || 0;
    this.featureUsageMap.set(key, currentCount + 1);

    // Check if we've reached any thresholds
    this.checkFeatureUsageThresholds(
      featureId,
      featureType,
      interactionType,
      currentCount + 1
    );

    // Log the interaction for debugging
    this.logger.debug(
      `Feature ${featureId} interaction (${interactionType}). New count: ${
        currentCount + 1
      }`
    );
  }

  /**
   * Handles session start events
   * @param {Object} data - Session start data
   * @private
   */
  handleSessionStart(data) {
    const { sessionId, timestamp } = data;

    // Record session start
    this.currentSessionId = sessionId;
    this.sessionStartTime = timestamp;

    // Update session count
    const sessionCount = this.sessionUsageMap.get("totalSessions") || 0;
    this.sessionUsageMap.set("totalSessions", sessionCount + 1);

    // Check for session-based accomplishments
    this.checkSessionCountThresholds(sessionCount + 1);

    // Log session start
    this.logger.info(
      `Session ${sessionId} started. Total sessions: ${sessionCount + 1}`
    );
  }

  /**
   * Handles session end events
   * @param {Object} data - Session end data
   * @private
   */
  handleSessionEnd(data) {
    const { sessionId, timestamp } = data;

    if (sessionId !== this.currentSessionId) {
      this.logger.warn(
        `Session end mismatch. Expected ${this.currentSessionId}, got ${sessionId}`
      );
      return;
    }

    // Calculate session duration
    const sessionDuration = timestamp - this.sessionStartTime;

    // Record session duration
    this.sessionUsageMap.set(`session_${sessionId}_duration`, sessionDuration);

    // Check for duration-based accomplishments
    this.checkSessionDurationThresholds(sessionId, sessionDuration);

    // Log session end
    this.logger.info(
      `Session ${sessionId} ended. Duration: ${sessionDuration}ms`
    );

    // Clear current session data
    this.currentSessionId = null;
    this.sessionStartTime = null;
  }

  /**
   * Checks if any item usage thresholds have been reached
   * @param {string} itemId - The ID of the item
   * @param {string} itemType - The type of the item
   * @param {number} count - The current usage count
   * @param {Object} context - Additional context about the usage
   * @private
   */
  checkItemUsageThresholds(itemId, itemType, count, context) {
    // Check for specific item usage accomplishments
    const accomplishments = this.getItemUsageAccomplishments(
      itemId,
      itemType,
      count
    );

    // Emit accomplishments if any were found
    if (accomplishments && accomplishments.length > 0) {
      accomplishments.forEach((accomplishment) => {
        this.emitAccomplishment({
          type: "usage",
          subType: "item",
          itemId,
          itemType,
          count,
          context,
          accomplishmentId: accomplishment.id,
          accomplishmentData: accomplishment.data,
        });
      });
    }
  }

  /**
   * Checks if any ability usage thresholds have been reached
   * @param {string} abilityId - The ID of the ability
   * @param {string} abilityType - The type of the ability
   * @param {number} count - The current usage count
   * @param {Object} context - Additional context about the usage
   * @private
   */
  checkAbilityUsageThresholds(abilityId, abilityType, count, context) {
    // Check for specific ability usage accomplishments
    const accomplishments = this.getAbilityUsageAccomplishments(
      abilityId,
      abilityType,
      count
    );

    // Emit accomplishments if any were found
    if (accomplishments && accomplishments.length > 0) {
      accomplishments.forEach((accomplishment) => {
        this.emitAccomplishment({
          type: "usage",
          subType: "ability",
          abilityId,
          abilityType,
          count,
          context,
          accomplishmentId: accomplishment.id,
          accomplishmentData: accomplishment.data,
        });
      });
    }
  }

  /**
   * Checks if any feature usage thresholds have been reached
   * @param {string} featureId - The ID of the feature
   * @param {string} featureType - The type of the feature
   * @param {string} interactionType - The type of interaction
   * @param {number} count - The current usage count
   * @private
   */
  checkFeatureUsageThresholds(featureId, featureType, interactionType, count) {
    // Check for specific feature usage accomplishments
    const accomplishments = this.getFeatureUsageAccomplishments(
      featureId,
      featureType,
      interactionType,
      count
    );

    // Emit accomplishments if any were found
    if (accomplishments && accomplishments.length > 0) {
      accomplishments.forEach((accomplishment) => {
        this.emitAccomplishment({
          type: "usage",
          subType: "feature",
          featureId,
          featureType,
          interactionType,
          count,
          accomplishmentId: accomplishment.id,
          accomplishmentData: accomplishment.data,
        });
      });
    }
  }

  /**
   * Checks if any session count thresholds have been reached
   * @param {number} count - The current session count
   * @private
   */
  checkSessionCountThresholds(count) {
    // Define session count milestones
    const sessionMilestones = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

    // Check if we've hit a milestone
    if (sessionMilestones.includes(count)) {
      this.emitAccomplishment({
        type: "usage",
        subType: "session",
        metric: "count",
        count,
        accomplishmentId: `session_count_${count}`,
        accomplishmentData: {
          title: `${count} Sessions Played`,
          description: `You've played ${count} sessions of the game!`,
          rewardTier: this.getRewardTierForSessionCount(count),
        },
      });
    }
  }

  /**
   * Checks if any session duration thresholds have been reached
   * @param {string} sessionId - The ID of the session
   * @param {number} duration - The duration of the session in milliseconds
   * @private
   */
  checkSessionDurationThresholds(sessionId, duration) {
    // Convert to minutes for easier threshold checking
    const durationMinutes = duration / (1000 * 60);

    // Define duration milestones in minutes
    const durationMilestones = [5, 15, 30, 60, 120, 240];

    // Find the highest milestone reached
    let highestMilestone = null;
    for (const milestone of durationMilestones) {
      if (durationMinutes >= milestone) {
        highestMilestone = milestone;
      } else {
        break;
      }
    }

    // Emit accomplishment if a milestone was reached
    if (highestMilestone) {
      this.emitAccomplishment({
        type: "usage",
        subType: "session",
        metric: "duration",
        sessionId,
        durationMinutes,
        accomplishmentId: `session_duration_${highestMilestone}`,
        accomplishmentData: {
          title: `${highestMilestone} Minute Session`,
          description: `You played for ${highestMilestone} minutes in a single session!`,
          rewardTier: this.getRewardTierForSessionDuration(highestMilestone),
        },
      });
    }
  }

  /**
   * Gets item usage accomplishments based on the current count
   * @param {string} itemId - The ID of the item
   * @param {string} itemType - The type of the item
   * @param {number} count - The current usage count
   * @returns {Array} Array of accomplishment objects
   * @private
   */
  getItemUsageAccomplishments(itemId, itemType, count) {
    // This would typically query a data source or configuration
    // For demonstration, we'll return some sample accomplishments
    const accomplishments = [];

    // Check for general usage count milestones
    const usageMilestones = [1, 10, 50, 100, 500, 1000];

    // Find the highest milestone reached
    for (const milestone of usageMilestones) {
      if (count === milestone) {
        accomplishments.push({
          id: `item_usage_${itemId}_${milestone}`,
          data: {
            title: `${itemType} Master (${milestone})`,
            description: `You've used the ${itemType} ${milestone} times!`,
            rewardTier: Math.min(Math.floor(Math.log10(milestone) + 1), 5),
          },
        });
        break;
      }
    }

    return accomplishments;
  }

  /**
   * Gets ability usage accomplishments based on the current count
   * @param {string} abilityId - The ID of the ability
   * @param {string} abilityType - The type of the ability
   * @param {number} count - The current usage count
   * @returns {Array} Array of accomplishment objects
   * @private
   */
  getAbilityUsageAccomplishments(abilityId, abilityType, count) {
    // This would typically query a data source or configuration
    // For demonstration, we'll return some sample accomplishments
    const accomplishments = [];

    // Check for general usage count milestones
    const usageMilestones = [1, 5, 25, 100, 250, 500];

    // Find the highest milestone reached
    for (const milestone of usageMilestones) {
      if (count === milestone) {
        accomplishments.push({
          id: `ability_usage_${abilityId}_${milestone}`,
          data: {
            title: `${abilityType} Adept (${milestone})`,
            description: `You've used the ${abilityType} ability ${milestone} times!`,
            rewardTier: Math.min(Math.floor(Math.log10(milestone) + 1), 5),
          },
        });
        break;
      }
    }

    return accomplishments;
  }

  /**
   * Gets feature usage accomplishments based on the current count
   * @param {string} featureId - The ID of the feature
   * @param {string} featureType - The type of the feature
   * @param {string} interactionType - The type of interaction
   * @param {number} count - The current usage count
   * @returns {Array} Array of accomplishment objects
   * @private
   */
  getFeatureUsageAccomplishments(
    featureId,
    featureType,
    interactionType,
    count
  ) {
    // This would typically query a data source or configuration
    // For demonstration, we'll return some sample accomplishments
    const accomplishments = [];

    // Check for general usage count milestones
    const usageMilestones = [1, 3, 10, 25, 50];

    // Find the highest milestone reached
    for (const milestone of usageMilestones) {
      if (count === milestone) {
        accomplishments.push({
          id: `feature_usage_${featureId}_${interactionType}_${milestone}`,
          data: {
            title: `${featureType} Explorer (${milestone})`,
            description: `You've interacted with the ${featureType} feature ${milestone} times!`,
            rewardTier: Math.min(Math.floor(Math.log10(milestone) + 1), 3),
          },
        });
        break;
      }
    }

    return accomplishments;
  }

  /**
   * Determines the reward tier based on session count
   * @param {number} count - The session count
   * @returns {number} The reward tier (1-5)
   * @private
   */
  getRewardTierForSessionCount(count) {
    if (count >= 1000) return 5;
    if (count >= 500) return 4;
    if (count >= 100) return 3;
    if (count >= 25) return 2;
    if (count >= 5) return 1;
    return 0;
  }

  /**
   * Determines the reward tier based on session duration
   * @param {number} durationMinutes - The session duration in minutes
   * @returns {number} The reward tier (1-5)
   * @private
   */
  getRewardTierForSessionDuration(durationMinutes) {
    if (durationMinutes >= 240) return 5;
    if (durationMinutes >= 120) return 4;
    if (durationMinutes >= 60) return 3;
    if (durationMinutes >= 30) return 2;
    if (durationMinutes >= 15) return 1;
    return 0;
  }

  /**
   * Emits an accomplishment event
   * @param {Object} data - The accomplishment data
   * @private
   */
  emitAccomplishment(data) {
    // Create the accomplishment data structure
    const accomplishmentData = new AccomplishmentUsageData({
      id: data.accomplishmentId,
      title: data.accomplishmentData.title,
      description: data.accomplishmentData.description,
      rewardTier: data.accomplishmentData.rewardTier,
      timestamp: Date.now(),
      type: data.type,
      subType: data.subType,
      metric: data.metric || "count",
      count: data.count,
      itemId: data.itemId,
      itemType: data.itemType,
      abilityId: data.abilityId,
      abilityType: data.abilityType,
      featureId: data.featureId,
      featureType: data.featureType,
      interactionType: data.interactionType,
      sessionId: data.sessionId,
      durationMinutes: data.durationMinutes,
      context: data.context,
    });

    // Emit the accomplishment event
    this.eventBus.publish("accomplishment.earned", {
      type: "usage",
      data: accomplishmentData,
    });

    // Log the accomplishment
    this.logger.info(
      `Usage accomplishment earned: ${data.accomplishmentData.title}`
    );
  }

  /**
   * Resets all usage tracking data
   * This is useful for testing or when starting a new game
   */
  resetUsageData() {
    this.itemUsageMap.clear();
    this.abilityUsageMap.clear();
    this.featureUsageMap.clear();
    this.sessionUsageMap.clear();
    this.logger.info("All usage tracking data has been reset");
  }

  /**
   * Gets the current usage statistics
   * @returns {Object} Usage statistics
   */
  getUsageStatistics() {
    return {
      items: Object.fromEntries(this.itemUsageMap),
      abilities: Object.fromEntries(this.abilityUsageMap),
      features: Object.fromEntries(this.featureUsageMap),
      sessions: Object.fromEntries(this.sessionUsageMap),
    };
  }
}
