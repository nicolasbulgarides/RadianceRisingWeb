//this class receives an accomplishment and then identifies a reward based off of the specific accomplishment
//Accomplishments may be boosted by the mojo system
//Accomplishment rewards may be static / fixed, static-random-hybrid (base reward + random reward), random, or "chaotic"
// Random rewards may be based off of a fixed typica range, whereas chaotic rewards may full from a broader, much more random and meme
//range
//
//
//
// (randomly chosen from a pool)

class AccomplishmentToRewardFactory {
  static convertAccomplishmentToReward(accomplishmentToReward) {
    let emptyRewardBundle = null;

    AccomplishmentToRewardFactory.addToRewardBundleBasedOffAccomplishmentCategory(
      accomplishmentToReward,
      emptyRewardBundle
    );
  }

  static addToRewardBundleBasedOffAccomplishmentCategory(
    accomplishmentToReward,
    combinedRewardBundle
  ) {
    let accomplishmentCategory = accomplishmentToReward.accomplishmentCategory;

    switch (accomplishmentCategory) {
      case "basic":
        AccomplishmentToRewardFactory.addBasicRewardsToRewardBundle(
          accomplishmentToReward,
          combinedRewardBundle
        );
        break;
      default:
        break;
    }
  }

  // to do - update implementation
  static addBasicRewardsToRewardBundle(accomplishmentToConvert, rewardBundle) {
    let itemToAdd = null;

    return rewardBundle;
  }
}
