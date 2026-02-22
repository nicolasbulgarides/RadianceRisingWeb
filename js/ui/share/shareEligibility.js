/**
 * ShareEligibility
 *
 * Determines whether the player qualifies to share a solution image.
 * All checks are stateless lookups against data provided at level completion.
 *
 * Eligibility criteria:
 *   - Level was completed (all lotuses collected)
 *   - Hearts remaining > 0
 *   - No hints were used during this attempt
 *
 * Exposed as window.ShareEligibility.
 */

class ShareEligibility {
    /**
     * @param {Object} completionData — the object saved by ShareImagePipeline at level complete:
     *   { levelId, totalMoves, heartsRemaining, hintsUsedForLevel }
     * @returns {{ eligible: boolean, reason: string }}
     */
    static canShare(completionData) {
        if (!completionData) {
            return { eligible: false, reason: "No completion data" };
        }

        const { heartsRemaining, hintsUsedForLevel, totalMoves } = completionData;

        if (typeof totalMoves !== "number" || totalMoves <= 0) {
            return { eligible: false, reason: "Not completed" };
        }

        if (typeof heartsRemaining === "number" && heartsRemaining <= 0) {
            return { eligible: false, reason: "No hearts remaining" };
        }

        if (hintsUsedForLevel === true) {
            return { eligible: false, reason: "Used hints" };
        }

        return { eligible: true, reason: "" };
    }
}

window.ShareEligibility = ShareEligibility;
