// Represents a composite history of a guild war.
// This includes information on the guilds involved, initial statements, and commentary.
class HistoryOfWarComposite {
  constructor(
    historyOfGuildWarUniqueId, // Unique ID of the guild war history.
    guildListA, // List of guilds in group A.
    guildListB, // List of guilds in group B.
    guildInitialStatementA, // Initial statement from guilds in group A.
    guildInitialStatementB, // Initial statement from guilds in group B.
    timestampOfGuildWarDeclaration, // Timestamp of the guild war declaration.
    assumedGuildWarHistoryImportance, // Assumed importance level of the guild war history.
    assumedGuildWarMemeWorthinessLevel, // Assumed meme worthiness level of the guild war.
    assumedGuildWarGloryLevel // Assumed glory level of the guild war.
  ) {
    // Initialize properties with provided values.
    this.historyOfGuildWarUniqueId = historyOfGuildWarUniqueId;
    this.guildListA = guildListA;
    this.guildListB = guildListB;
    this.guildInitialStatementA = guildInitialStatementA;
    this.guildInitialStatementB = guildInitialStatementB;
    this.timestampOfGuildWarDeclaration = timestampOfGuildWarDeclaration;
    this.assumedGuildWarHistoryImportance = assumedGuildWarHistoryImportance;
    this.assumedGuildWarMemeWorthinessLevel =
      assumedGuildWarMemeWorthinessLevel;
    this.assumedGuildWarGloryLevel = assumedGuildWarGloryLevel;
    this.informedGuildWarHistoryImportance = 0;
    this.informedRivalryMemeWorthinessLevel = 0;
    this.informedRivalryGloryLevel = 0;
    this.guildCommentariesA = [];
    this.guildCommentariesB = [];
    this.neutralCommentaries = [];
  }

  // Updates the informed rivalry history importance level.
  updateRivalryHistoryImportance(newImportance) {
    this.informedRivalryHistoryImportance = newImportance;
  }

  // Updates the informed rivalry meme worthiness level.
  updateRivalryMemeWorthiness(newWorthiness) {
    this.informedRivalryMemeWorthinessLevel = newWorthiness;
  }

  // Updates the informed rivalry glory level.
  updateRivalryGloryLevel(newGlory) {
    this.informedRivalryGloryLevel = newGlory;
  }

  // Adds a new commentary to the list of guild A commentaries.
  addGuildListACommentary(newGuildListACommentary) {
    this.guildCommentariesA.push(newGuildListACommentary);
  }

  // Adds a new commentary to the list of guild B commentaries.
  addGuildListBCommentary(newGuildListBCommentary) {
    this.guildCommentariesB.push(newGuildListBCommentary);
  }

  // Adds a new neutral commentary to the list of neutral commentaries.
  addNeutralCommentary(newNeutralCommentary) {
    this.neutralCommentaries.push(newNeutralCommentary);
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
