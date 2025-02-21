//Guild statements are issued by one or more guilds to one or more other guilds or other players, and involve one or more players.
//They are a snapshot in time and cannot be changed once issued.
// Represents a statement issued by one or more guilds.
// This includes information on the guilds involved, the statement's content, and related events.
class HistoryGuildStatement {
  constructor(
    guildStatementUniqueId, // Unique ID of the guild statement.
    uniqueIdOfDeclaredWar, // Unique ID of the declared war.
    timestampOfIssuedStatement, // Timestamp of when the statement was issued.
    guildsIssuingTheStatement, // Guilds issuing the statement.
    guildsStatementAsIssued, // Content of the statement as issued.
    guildsReceivingTheStatement, // Guilds receiving the statement.
    publicPlayerProfileIdsOfSignatories, // Public player profile IDs of signatories.
    publicPlayerProfileIdsOfMentionedAdversaries, // Public player profile IDs of mentioned adversaries.
    publicPlayerProfileIdsOfMentionedNeutralPlayers, // Public player profile IDs of mentioned neutral players.
    uniqueIdsOfRelevantReferencedStatementIds, // Unique IDs of relevant referenced statements.
    uniqueIdsOfRelevantReferencedEventIds // Unique IDs of relevant referenced events.
  ) {
    // Initialize properties with provided values.
    this.guildStatementUniqueId = guildStatementUniqueId;
    this.timestampOfIssuedStatement = timestampOfIssuedStatement;
    this.uniqueIdOfDeclaredWar = uniqueIdOfDeclaredWar;
    this.guildsIssuingTheStatement = guildsIssuingTheStatement;
    this.guildsStatementAsIssued = guildsStatementAsIssued;
    this.guildsReceivingTheStatement = guildsReceivingTheStatement;
    this.publicPlayerProfileIdsOfSignatories =
      publicPlayerProfileIdsOfSignatories;
    this.publicPlayerProfileIdsOfMentionedAdversaries =
      publicPlayerProfileIdsOfMentionedAdversaries;
    this.publicPlayerProfileIdsOfMentionedNeutralPlayers =
      publicPlayerProfileIdsOfMentionedNeutralPlayers;
    this.uniqueIdsOfRelevantReferencedStatementIds =
      uniqueIdsOfRelevantReferencedStatementIds;
    this.uniqueIdsOfRelevantReferencedEventIds =
      uniqueIdsOfRelevantReferencedEventIds;
    this.notorietyData = null; // Notoriety data related to the statement.
  }

  // Consider adding a method to validate the guild statement data.
  // validateData() {
  //   // Implement validation logic here.
  // }
}
