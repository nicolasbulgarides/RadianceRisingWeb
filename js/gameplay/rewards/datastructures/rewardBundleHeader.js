/**
 * RewardBundleHeader represents the metadata and identifying information for a reward bundle.
 * This class encapsulates all descriptive information about a reward package without containing
 * the actual reward contents, serving as a header or manifest for the complete reward bundle.
 */
class RewardBundleHeader {
  /**
   * Creates a new RewardBundleHeader instance.
   * @param {string} bundleId - Unique identifier for the reward bundle
   * @param {string} bundleName - Display name of the reward bundle
   * @param {string} bundleCategory - Category classification of the bundle (e.g., "Daily", "Achievement", "Special")
   * @param {string} bundleDescription - Detailed description of the reward bundle contents and purpose
   */
  constructor(bundleId, bundleName, bundleCategory, bundleDescription) {
    this.bundleId = bundleId;
    this.bundleName = bundleName;
    this.bundleCategory = bundleCategory;
    this.bundleDescription = bundleDescription;
  }
}
