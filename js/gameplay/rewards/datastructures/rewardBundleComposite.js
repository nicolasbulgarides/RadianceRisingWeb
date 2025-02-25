class RewardBundleComposite {
  //composite object to be used to store all reward data for a given bundle organized into sub classes for organization
  constructor(rewardBundleHeader, rewardBasic, rewardUnlocks, rewardSpecial) {
    this.rewardBundleHeader = rewardBundleHeader;
    this.rewardBasic = rewardBasic;
    this.rewardUnlocks = rewardUnlocks;
    this.rewardSpecial = rewardSpecial;
  }
}
