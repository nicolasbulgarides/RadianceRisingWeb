/**
 * Audits and validates all mojo-related events to ensure fair play and proper reward distribution.
 * Acts as a safeguard against exploits and ensures mojo rewards/penalties are justified.
 */
class MojoAuditor {
  /**
   * Evaluates negative mojo events to determine if punishment should be applied.
   * @param {Player} playerToAuditMojo - The player whose mojo event is being audited
   * @param {MojoEvent} mojoEventUnderConsideration - The negative event to evaluate
   * @returns {boolean} Whether the punishment should be applied
   */
  static auditNegativeMojoEvent(
    playerToAuditMojo,
    mojoEventUnderConsideration
  ) {
    let mojoNegativeSeverity = mojoEventUnderConsideration.mojoNegativeSeverity;

    let mojoDoPunishmentVeridct = false;

    switch (mojoNegativeSeverity) {
      case "mojoevent-negative-minor":
        mojoDoPunishmentVeridct = MojoAuditor.auditMinorMojoPointPunishment(
          playerToAuditMojo,
          mojoEventUnderConsideration
        );
        break;
      case "mojoevent-negative-major":
        mojoDoPunishmentVeridct = MojoAuditor.auditMajorMojoPointPunishment(
          playerToAuditMojo,
          mojoEventUnderConsideration
        );
        break;
      case "mojoevent-negative-catastrophe":
        mojoDoPunishmentVeridct =
          MojoAuditor.auditCatstropheMojoPointPunishment(
            playerToAuditMojo,
            mojoEventUnderConsideration
          );
        break;
    }

    return mojoDoPunishmentVeridct;
  }

  /**
   * Evaluates positive mojo events to determine if rewards should be granted.
   * Checks for legitimacy of achievements and prevents reward exploitation.
   * @param {Player} playerToAuditMojo - The player whose mojo event is being audited
   * @param {MojoEvent} mojoEventUnderConsideration - The positive event to evaluate
   * @returns {boolean} Whether the reward should be granted
   */
  static auditPositiveMojoEvent(
    playerToAuditMojo,
    mojoEventUnderConsideration
  ) {
    //to do - this class will audit the positive mojo event and return a boolean value

    let mojoWillBeRewarded = true;

    return mojoWillBeRewarded;
  }

  /**
   * Evaluates minor negative mojo events for potential punishment.
   * @returns {boolean} Whether minor punishment should be applied
   */
  static auditMinorMojoPointPunishment() {
    // TODO: Implement this

    let mojoWillBePunished = false;

    return mojoWillBePunished;
  }

  /**
   * Evaluates major negative mojo events for potential punishment.
   * @returns {boolean} Whether major punishment should be applied
   */
  static auditMajorMojoPointPunishment() {
    // TODO: Implement this

    let mojoWillBePunished = false;

    return mojoWillBePunished;
  }

  /**
   * Evaluates catastrophic mojo events for potential severe punishment.
   * @returns {boolean} Whether catastrophic punishment should be applied
   */
  static auditCatstropheMojoPointPunishment() {
    // TODO: Implement this

    let mojoWillBePunished = false;

    return mojoWillBePunished;
  }
}
