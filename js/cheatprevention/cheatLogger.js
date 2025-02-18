class CheatLogger {
  static CHEAT_LOG_OVERRIDE = false;
  static CHEAT_LOG_ENABLED = false;
  static CHEAT_LOG_REPORT_ENABLED = false;
  static CHEAT_REPORT_VALIDATION_CODE = "[cheat-detected]";

  static reportCheatOccurence(cheatDetection) {
    let cheatReportToPlayerNetworkAPIRequest =
      this.formCheatReportToPlayer(cheatDetection);

    let cheatReportToSystemAdminNetworkAPIRequest =
      this.formCheatReportToSystemAdmin(cheatDetection);

    let NetworkManager = FundamentalSystemBridge.getNetworkManager();

    if (networkManager != null && NetworkManager instanceof NetworkingManager) {
      let sender = "-processed-by-cheat-logger-cheat-category: ";

      if (cheatDetection.wasMultipleCheatsDetected) {
        sender += "-multiple-cheats-detected-";
      } else if (cheatDetection.cheatCategories.length > 0) {
        sender += cheatDetection.cheatCategories[0];
      } else {
        sender += "-blank-cheat-detection-mistake-made-by-cheat-logger-";
      }

      NetworkManager.processRequestViaAPIRequestRouter(
        cheatReportToPlayerNetworkAPIRequest,
        "-cheat-detection-to-player-",
        +sender
      );
      NetworkManager.processRequestViaAPIRequestRouter(
        cheatReportToSystemAdminNetworkAPIRequest,
        "-cheat-detection-to-admin-",
        +sender
      );
    }
  }

  static formSingleCheatReportToPlayer(cheatDetection) {
    let cheatCategoryFormal =
      this.convertCheatCategoryIdToFormalName(cheatCategory);
    let cheatMessage =
      "You have been detected cheating. The detected cheat category is: " +
      cheatCategoryFormal +
      ", and this cheat was detected at: " +
      cheatDetection.cheatTimestamp +
      ". In response to your detected cheat, the following actions have been taken: " +
      cheatDetection.cheatOutcome +
      ". Our reasoning for this response is: " +
      cheatDetection.cheatOutcomeExplanation +
      ". If you feel this response was unfair, or the result of an error or glitch, please click the Dispute Button, or email us at customerservice@radiant-rays.com.";
    ("If your punishment was determined to be unjust or excessive, or that it doesn't fully consider your context as a loyal player, we will apologize and compensate you for your inconvenience. We make mistakes!");

    let cheatReportToPlayerAPIOBject = new NetworkAPIOBject(
      cheatDetection.cheatTimestamp,
      this.CHEAT_REPORT_VALIDATION_CODE,
      "-cheat-detection-",
      cheatMessage
    );

    return cheatReportToPlayerAPIOBject;
  }
  static convertCheatCategoryIdToFormalName(cheatDetection) {
    let cheatCategoryFormalName =
      "[no cheat detected: did we make a mistake? Please hit report bug!";

    let cheatsDetected = cheatDetection.cheatCategories;

    if (cheatsDetected.length > 1) {
      cheatCategoryFormalName =
        "Multiple Cheats Detected! What the heck are you doing?! If this is true, please reconsider your actions.";
    } else {
      switch (cheatCategoryId) {
        case "premiumbypass":
          cheatCategoryFormalName = "Premium Bypass";
          break;
        case "accountagebypass":
          cheatCategoryFormalName = "Account Age Bypass";
          break;
        case "minlevelbypass":
          cheatCategoryFormalName = "Minimum Level Bypass";
          break;
        case "minmagicbypass":
          cheatCategoryFormalName = "Minimum Magic Bypass";
          break;
        case "minimumhealthpointsbypass":
          cheatCategoryFormalName = "Minimum Health Points Bypass";
          break;
        case "minimummagicpointsbypass":
          cheatCategoryFormalName = "Minimum Magic Points Bypass";
          break;
        case "artifactposessionbypass":
          cheatCategoryFormalName = "Artifact Possession Bypass";
          break;
        case "constellationunlockbypass":
          cheatCategoryFormalName = "Constellation Unlock Bypass";
          break;
        case "levelunlockbypass":
          cheatCategoryFormalName = "Level Unlock Bypass";
          break;
        case "specialareabypass":
          cheatCategoryFormalName = "Special Area Bypass";
          break;
        case "gamemodebypass":
          cheatCategoryFormalName = "Game Mode Bypass";
          break;
        case "achievementbypass":
          cheatCategoryFormalName = "Achievement Bypass";
          break;
        case "groupofachievementbypass":
          cheatCategoryFormalName = "Group of Achievement Bypass";
          break;
        default:
          cheatCategoryFormalName =
            "[no cheat detected: did we make a mistake? Please hit report bug!";
      }
    }
    return cheatCategoryFormalName;
  }
}
