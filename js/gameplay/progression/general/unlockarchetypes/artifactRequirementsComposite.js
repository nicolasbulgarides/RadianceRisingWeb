/**
 * ArtifactRequirementsComposite
 * Composite class for artifact-based unlock requirements.
 * Manages the conditions that require specific artifacts to be obtained to unlock content.
 * Extends RequirementsGeneral.
 */
class ArtifactRequirementsComposite extends RequirementsGeneral {
  /**
   * @param {Array|Object} artifactRequirements - The artifact conditions or list of required artifacts.
   */
  constructor(artifactRequirements) {
    this.artifactRequirements = artifactRequirements;
  }
}
