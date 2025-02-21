class PublicPlayerProfile {
  constructor(
    playerPublicId = null,
    playerCurrentNickname = null,
    playerCurrentPersonaCode = null,
    playerCurrentSocialDesires = null,
    playerCountryOfDesiredRepresentation = null,
    playerCurrentGuild = null,
    playerCurrentActiveTitle = null,
    playerAcheivementPointsTotal = null
  ) {
    this.playerPublicId = playerPublicId;
    this.playerCurrentNickname = playerCurrentNickname;
    this.playerCurrentPersonaCode = playerCurrentPersonaCode;
    this.playerCurrentSocialDesires = playerCurrentSocialDesires;
    this.playerCountryOfDesiredRepresentation =
      playerCountryOfDesiredRepresentation;
    this.playerCurrentGuild = playerCurrentGuild;
    this.playerCurrentActiveTitle = playerCurrentActiveTitle;
    this.playerAcheivementPointsTotal = playerAcheivementPointsTotal;
  }
}
