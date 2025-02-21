// Represents a composite history of a rivalry between players.
// This includes information on the players involved, initial statements, and commentary.
class HistoryOfRivalryComposite {
  constructor(
    historyOfRivalryUniqueId, // Unique ID of the rivalry history.
    rivalPlayerA, // Player A involved in the rivalry.
    rivalPlayerB, // Player B involved in the rivalry.
    playerAInitialStatement, // Initial statement from player A.
    playerBInitialStatement, // Initial statement from player B.
    timestampOfRivalryDeclaration, // Timestamp of the rivalry declaration.
    assumedRivalryHistoryImportance, // Assumed importance level of the rivalry history.
    assumedRivalryMemeWorthinessLevel, // Assumed meme worthiness level of the rivalry.
    assumedRivalryGloryLevel, // Assumed glory level of the rivalry.
    assumedListOfInitiallyInterestedNeutralCommentators // List of initially interested neutral commentators.
  ) {
    // Initialize properties with provided values.
    this.historyOfRivalryUniqueId = historyOfRivalryUniqueId;
    this.rivalPlayerA = rivalPlayerA;
    this.rivalPlayerB = rivalPlayerB;
    this.playerAInitialStatement = playerAInitialStatement;
    this.playerBInitialStatement = playerBInitialStatement;
    this.rivalACommentaries = [];
    this.rivalBCommentaries = [];
    this.timestampOfRivalryDeclaration = timestampOfRivalryDeclaration;
    this.assumedRivalryHistoryImportance = assumedRivalryHistoryImportance;
    this.assumedRivalryMemeWorthinessLevel = assumedRivalryMemeWorthinessLevel;
    this.assumedRivalryGloryLevel = assumedRivalryGloryLevel;
    this.asssumedListOfInitiallyInterestedNeutralCommentators =
      assumedListOfInitiallyInterestedNeutralCommentators;

    this.informedRivalryHistoryImportance = 0;
    this.informedRivalryMemeWorthinessLevel = 0;
    this.informedRivalryGloryLevel = 0;
    this.informedListOfAllInvolvedNeutralCommentators = [];
    this.informedListOfCommentatorsWhoWithdrewInterest = [];
  }

  // Adds a new commentary to the list of rival A commentaries.
  addRivalACommentary(newRivalACommentary) {
    this.rivalACommentaries.push(newRivalACommentary);
  }

  // Adds a new commentary to the list of rival B commentaries.
  addRivalBCommentary(newRivalBCommentary) {
    this.rivalBCommentaries.push(newRivalBCommentary);
  }

  // Updates the informed rivalry history importance level.
  updateRivalryHistoryImportance(newImportanceLevel) {
    this.informedRivalryHistoryImportance = newImportanceLevel;
  }

  // Updates the informed rivalry meme worthiness level.
  updateRivalryMemeWorthinessLevel(newWorthinessLevel) {
    this.informedRivalryMemeWorthinessLevel = newWorthinessLevel;
  }

  // Updates the informed rivalry glory level.
  updateRivalryGloryLevel(newGloryLevel) {
    this.informedRivalryGloryLevel = newGloryLevel;
  }

  // Updates the list of neutral commentators involved in the rivalry.
  updateListOfNeutralCommentators(publicIdOfInvolvedNeutralCommentator) {
    if (
      this.informedListOfAllInvolvedNeutralCommentators.includes(
        publicIdOfInvolvedNeutralCommentator
      )
    ) {
      return;
    }
    this.informedListOfAllInvolvedNeutralCommentators.push(
      publicIdOfInvolvedNeutralCommentator
    );
  }

  // Updates the list of commentators who withdrew interest in the rivalry.
  updateListOfCommentatorsWhoWithdrewInterest(
    publicIdOfWithdrewInterestCommentator
  ) {
    if (
      this.informedListOfCommentatorsWhoWithdrewInterest.includes(
        publicIdOfWithdrewInterestCommentator
      )
    ) {
      return;
    }
    this.informedListOfCommentatorsWhoWithdrewInterest.push(
      publicIdOfWithdrewInterestCommentator
    );
  }
}
