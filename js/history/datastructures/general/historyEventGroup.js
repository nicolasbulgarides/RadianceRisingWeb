// Represents a group of related history events.
// This includes information on the group's category, description, and importance.
class HistoryEventGroup {
  constructor(
    groupKey, // Unique key identifying the group.
    groupCategory, // Category of the group.
    groupSubCategory, // Sub-category of the group.
    groupHandyDescription, // Handy description of the group.
    timestampOfGroupParticipants, // Timestamp of the group's participants.
    assumedHistoryImportance, // Assumed importance level of the group's history.
    assumedMemeWorthinessLevel, // Assumed meme worthiness level of the group.
    assumedGloryLevelDueToInfluencerPresence // Assumed glory level due to influencer presence.
  ) {
    // Initialize properties with provided values.
    this.groupKey = groupKey;
    this.groupCategory = groupCategory;
    this.groupSubCategory = groupSubCategory;
    this.groupHandyDescription = groupHandyDescription;
    this.timestampOfGroupParticipants = timestampOfGroupParticipants;
    this.assumedHistoryImportanceLevel = assumedHistoryImportance;
    this.informedHistoryImportanceLevel = 0; // Used to determine if a specific history group is important enough for usage in other systems, such as display in a UI, broadcasting to other players or saving to a database.
    this.assumedMemeWorthinessLevel = assumedMemeWorthinessLevel;
    this.informedMemeWorthinessLevel = 0; // Used to determine if a specific history group is worth sharing with other players.
    this.assumedGloryLevelDueToInfluencerPresence =
      assumedGloryLevelDueToInfluencerPresence; // Pre-determined based off initial participation by an influencer based off of the influencer's social noteworthiness.
    this.informedGloryLevelDueToInfluencerPresence = 0; // If an influencer is added to the group, this will be updated to the influencer's glory level / social noteworthiness.
    this.informedGloryDueToPerceptionOfInfluencerAssessmentByCommunity = 0; // If players are responding with enthusiasm, be it praise or criticism, this will be updated to reflect the community's interest in the overall set of events.
  }

  // Updates the assumed history importance level.
  updateHistoryImportance(newImportance) {
    this.assumedHistoryImportanceLevel = newImportance;
  }

  // Updates the assumed meme worthiness level.
  updateMemeWorthiness(newWorthiness) {
    this.assumedMemeWorthinessLevel = newWorthiness;
  }

  // Updates both the assumed history importance and meme worthiness levels.
  updateHistoryImportanceAndMemeWorthiness(newImportance, newMemeWorthiness) {
    this.assumedHistoryImportanceLevel = newImportance;
    this.assumedMemeWorthinessLevel = newMemeWorthiness;
  }

  // Updates the assumed glory level due to influencer presence.
  updateGloryLevelDueToInfluencerPresence(newGlory) {
    this.assumedGloryLevelDueToInfluencerPresence = newGlory;
  }

  // Updates the informed glory level due to community perception of influencer assessment.
  updateGloryDueToPerceptionOfInfluencerAssessmentByCommunity(newGlory) {
    this.informedGloryDueToPerceptionOfInfluencerAssessmentByCommunity =
      newGlory;
  }
}
