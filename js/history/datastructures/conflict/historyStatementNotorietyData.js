// Represents notoriety data related to a statement or commentary.
// This includes information on social media metrics and references.
class HistoryStatementNotorietyData {
  constructor(
    isAStatement, // Whether the data is related to a statement.
    isACommentary = false, // Whether the data is related to a commentary.
    statementOrCommentaryUniqueId, // Unique ID of the statement or commentary.
    numberOfLoves, // Number of "loves" received.
    numberOfLikes, // Number of "likes" received.
    numberOfShares, // Number of shares received.
    numberofCasualComments, // Number of casual comments received.
    numberOfFormalReplies, // Number of formal replies received.
    numberOfTimesReferenced, // Number of times referenced.
    numberOfTimesFeaturedInArticles // Number of times featured in articles.
  ) {
    // Initialize properties with provided values.
    this.isAStatement = isAStatement;
    this.isACommentary = isACommentary;
    this.statementOrCommentaryUniqueId = statementOrCommentaryUniqueId;
    this.numberOfLoves = numberOfLoves;
    this.numberOfLikes = numberOfLikes;
    this.numberOfShares = numberOfShares;
    this.numberofCasualComments = numberofCasualComments;
    this.numberOfFormalReplies = numberOfFormalReplies;
    this.numberOfTimesReferenced = numberOfTimesReferenced;
    this.numberOfTimesFeaturedInArticles = numberOfTimesFeaturedInArticles;
  }

  // Consider adding a method to calculate the total engagement score.
  // calculateEngagementScore() {
  //   return this.numberOfLoves + this.numberOfLikes + this.numberOfShares;
  // }
}
