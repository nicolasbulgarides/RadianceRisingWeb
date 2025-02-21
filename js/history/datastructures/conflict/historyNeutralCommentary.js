// Represents neutral commentary related to a history event.
// This includes information on the commentary's content and related players and events.
class HistoryNeutralCommentary {
  constructor(
    neutralCommentaryUniqueId, // Unique ID of the neutral commentary.
    neutralCommentaryTimestamp, // Timestamp of the commentary.
    neutralCommentaryText, // Text of the commentary.
    guildsReceivingTheStatement, // Guilds receiving the statement.
    publicPlayerProfileIdsOfSignatories, // Public player profile IDs of signatories.
    publicPlayerProfileIdsOfMentionedPlayers, // Public player profile IDs of mentioned players.
    uniqueIdsOfRelevantReferencedStatementIds, // Unique IDs of relevant referenced statements.
    uniqueIdsOfRelevantReferencedEventIds // Unique IDs of relevant referenced events.
  ) {
    // Initialize properties with provided values.
    this.neutralCommentaryUniqueId = neutralCommentaryUniqueId;
    this.neutralCommentaryTimestamp = neutralCommentaryTimestamp;
    this.neutralCommentaryText = neutralCommentaryText;
    this.guildsReceivingTheStatement = guildsReceivingTheStatement;
    this.publicPlayerProfileIdsOfSignatories =
      publicPlayerProfileIdsOfSignatories;
    this.publicPlayerProfileIdsOfMentionedPlayers =
      publicPlayerProfileIdsOfMentionedPlayers;
    this.uniqueIdsOfRelevantReferencedStatementIds =
      uniqueIdsOfRelevantReferencedStatementIds;
    this.uniqueIdsOfRelevantReferencedEventIds =
      uniqueIdsOfRelevantReferencedEventIds;
  }

  // Consider adding a method to serialize the commentary for storage or transmission.
  // serialize() {
  //   return JSON.stringify(this);
  // }
}
