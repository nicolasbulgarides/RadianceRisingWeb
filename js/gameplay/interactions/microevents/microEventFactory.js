class MicroEventFactory {
  static generateAllMicroEventsForLevel(levelDataComposite) {
    // Microevents are now created directly by the sequential level loader
    // from actual level data, not from placeholders
    return [];
  }


  static generateSingleStardustPickup(pickupLocation) {
    let nickName = "Stardust Pickup";
    let description = "You grasped the iridescent glow of a stardust fragment!";
    let pickupValue = "stardust";
    let pickupMagnitude = 1;

    return this.generatePickup(
      nickName,
      description,
      pickupValue,
      pickupMagnitude,
      pickupLocation
    );
  }

  static verifyMicroEventCompatibility(
    nicknamesToCheck,
    allUniqueIdsToCheck,
    allLocationsToCheck
  ) {
    let allEqualLength = false;

    let nicknameLength = nicknamesToCheck.length;
    let uniqueIdLength = allUniqueIdsToCheck.length;
    let locationLength = allLocationsToCheck.length;

    if (
      nicknameLength === uniqueIdLength &&
      nicknameLength === locationLength
    ) {
      allEqualLength = true;
    }

    return allEqualLength;
  }
  //to do update logging
  static generateGroupDefeatMicroEvents(
    allNicknames,
    allUniqueIds,
    allLocations
  ) {
    let allFoeDefeatMicroEvents = [];

    let compatibleLengthVerified = this.verifyMicroEventCompatibility(
      allNicknames,
      allUniqueIds,
      allLocations
    );

    //to do update logging
    if (!compatibleLengthVerified) {
      console.error(
        "Microevent factory - allNicknames, allUniqueIds, and allLocations must have the same length"
      );
      return allFoeDefeatMicroEvents;
    } else if (compatibleLengthVerified) {
      for (let i = 0; i < allNicknames.length; i++) {
        allFoeDefeatMicroEvents.push(
          this.generateSingleDefeatMicroEvent(
            allNicknames[i],
            allUniqueIds[i],
            allLocations[i]
          )
        );
      }
      return allFoeDefeatMicroEvents;
    }
  }

  static generateSingleDefeat(foeNickname, foeUniqueId, foeLocation) {
    let foeDefeatNickname = "Foe Defeat: " + foeNickname;
    let foeDefeatMessage = "You defeated the foe: " + foeNickname;
    return new MicroEvent(
      "foeDefeat",
      foeDefeatNickname,
      foeDefeatMessage,
      foeUniqueId,
      1,
      foeLocation
    );
  }

  //to do - add translation system / retrieval system for the description
  static generateStardustCloudPickup(stardustCloudLocation) {
    let nickName = "Stardust Cluster Pickup";
    let description =
      "The ethereal glow of a stardust cloud wraps around you!!";
    let pickupValue = "stardust";
    let pickupMagnitude = 1;

    return this.generatePickup(
      "stardustClusterPickup",
      nickName,
      description,
      pickupValue,
      pickupMagnitude,
      stardustCloudLocation
    );
  }

  static generatePickup(
    nickName,
    description,
    pickupValue,
    pickupMagnitude,
    pickupLocation,
    pickupPositionedObject
  ) {
    let pickupMicroEvent = new MicroEvent(
      "pickup",
      nickName,
      description,
      pickupValue,
      pickupMagnitude,
      pickupLocation,
      pickupPositionedObject
    );

    return pickupMicroEvent;
  }

  static generateDamage(
    nickName,
    description,
    damageType,
    damageMagnitude,
    damageLocation,
    damagePositionedObject
  ) {
    let damageMicroEvent = new MicroEvent(
      "damage",
      nickName,
      description,
      damageType,
      damageMagnitude,
      damageLocation,
      damagePositionedObject
    );

    return damageMicroEvent;
  }

  //this function will take the levelDataComposite and assemble the micro events for the level
  //to do - some planning as to how to efficiently assemble the micro events for the level aka not
  //have to specify every coin pick up in the level
  static assembleAllMicroEventsForLevel(levelDataComposite) {
    let allLevelMicroEvents = [];

    return allLevelMicroEvents;
  }
}
