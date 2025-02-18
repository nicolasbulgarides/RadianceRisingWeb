class RegionalAdaptionProfile {
  constructor(
    adaptionId,
    adaptionNickName,
    adaptionOwners,
    adapationGameDataComposite
  ) {
    this.adaptionId = adaptionId;
    this.adaptionNickName = adaptionNickName;
    this.adaptionOwners = adaptionOwners;
    this.adapationGameDataComposite = adapationGameDataComposite; // holds URLs, manifests, etc.
  }

  // Updated: Loads additional regional profile data using credentials and router endpoint.
  async loadProfileData(credentials) {
    console.log("Loading profile data for", this.adaptionNickName);
    try {
      // Build the API endpoint using the router and the access code from credentials
      const profileApiUrl =
        RegionalAdaptionRouter.getRegionalProfileApiEndpoint(
          this.adaptionNickName,
          credentials.regionalStaticAccessCode
        );
      const response = await fetch(profileApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      // Update profile properties and gameDataComposite if provided in the response
      if (data.gameDataComposite) {
        this.adapationGameDataComposite.parseGameData(data.gameDataComposite);
      }
      console.log("Regional profile data loaded:", data);
    } catch (error) {
      console.error("Failed to load regional profile data:", error);
      // TODO: Add fallback mechanism or further error handling.
    }
  }

  // ... (other methods remain unchanged)
}
