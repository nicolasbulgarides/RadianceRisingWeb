/**
 * Emitter for technical-related accomplishments.
 *
 * This class provides presets for technical accomplishments such as
 * performance optimizations, bug reporting, and technical milestones.
 */
class TechnicalEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      bugReported: {
        category: "technical",
        subCategory: "bug",
        metaData: {
          nickName: "Bug Reported",
          description: "Player has reported a bug",
        },
        defaultData: {
          technicalEventType: "bug-report",
          technicalEventCategory: "user-feedback",
          technicalEventSeverity: "normal",
          technicalEventImpact: "low",
          technicalEventResolution: "pending",
          technicalEventRewardTier: "standard",
          technicalEventData: {},
        },
      },
      performanceOptimized: {
        category: "technical",
        subCategory: "performance",
        metaData: {
          nickName: "Performance Optimized",
          description: "Game performance has been optimized for player",
        },
        defaultData: {
          technicalEventType: "performance",
          technicalEventCategory: "optimization",
          technicalEventSeverity: "normal",
          technicalEventImpact: "medium",
          technicalEventResolution: "completed",
          technicalEventRewardTier: "none",
          technicalEventData: {
            previousFps: 0,
            currentFps: 0,
            optimizationMethod: "",
          },
        },
      },
      clientUpdate: {
        category: "technical",
        subCategory: "update",
        metaData: {
          nickName: "Client Update",
          description: "Player has updated to a new client version",
        },
        defaultData: {
          technicalEventType: "update",
          technicalEventCategory: "client",
          technicalEventSeverity: "normal",
          technicalEventImpact: "medium",
          technicalEventResolution: "completed",
          technicalEventRewardTier: "standard",
          technicalEventData: {
            previousVersion: "",
            currentVersion: "",
            updateSize: 0,
            updateFeatures: [],
          },
        },
      },
      betaTester: {
        category: "technical",
        subCategory: "beta",
        metaData: {
          nickName: "Beta Tester",
          description: "Player has participated in beta testing",
        },
        defaultData: {
          technicalEventType: "beta",
          technicalEventCategory: "testing",
          technicalEventSeverity: "normal",
          technicalEventImpact: "high",
          technicalEventResolution: "completed",
          technicalEventRewardTier: "premium",
          technicalEventData: {
            betaPhase: "",
            betaDuration: 0,
            feedbackProvided: false,
            bugsReported: 0,
          },
        },
      },
      technicalMilestone: {
        category: "technical",
        subCategory: "milestone",
        metaData: {
          nickName: "Technical Milestone",
          description: "Player has reached a technical milestone",
        },
        defaultData: {
          technicalEventType: "milestone",
          technicalEventCategory: "achievement",
          technicalEventSeverity: "normal",
          technicalEventImpact: "low",
          technicalEventResolution: "completed",
          technicalEventRewardTier: "standard",
          technicalEventData: {
            milestoneType: "",
            milestoneValue: 0,
            milestoneDescription: "",
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
