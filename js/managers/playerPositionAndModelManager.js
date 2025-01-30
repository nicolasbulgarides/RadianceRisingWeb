class PlayerPositionAndModelManager {
  constructor(playerModelObject, position) {
    this.playerModelPositionedObject = playerModelObject;

    this.currentXPosition = position.x;
    this.currentYPosition = position.y;
    this.currentZPosition = position.z;
    this.pathingDestination = null;
    console.log(
      "Player position loaded at: " +
        this.currentXPosition +
        " , y " +
        this.currentYPosition +
        ",z " +
        this.currentZPosition
    );
  }
  setCurrentPathingDestination(x, y, z) {
    this.pathingDestination = {
      xPosition: x,
      yPosition: y,
      zPosition: z,
    };
  }

  getPositionVector() {
    const position = new BABYLON.Vector3(
      this.currentXPosition,
      this.currentYPosition,
      this.currentZPosition
    );
    return position;
  }
  // Update position
  setPositionNoMotion(x, y, z) {
    this.currentXPosition = x;
    this.currentYPosition = y;
    this.currentZPosition = z;
  }

  adjustPositionNoMotion(x, y, z) {
    this.currentXPosition += x;
    this.currentYPosition += y;
    this.currentZPosition += z;
  }

  adjustPositionRelocateModelInstantly(x, y, z) {
    this.currentXPosition += x;
    this.currentYPosition += y;
    this.currentZPosition += z;
    this.relocateToCurrentPositionInstantly;
  }

  setPositionRelocateModelInstantly(x, y, z) {
    this.currentXPosition = x;
    this.currentYPosition = y;
    this.currentZPosition = z;

    this.relocateToCurrentPositionInstantly;
  }

  relocateToCurrentPositionInstantly() {
    this.playerModelPositionedObject.setPosition(
      this.currentXPosition,
      this.currentYPosition,
      this.currentZPosition
    );
  }

  getPlayerModelDirectly() {
    if (this.playerModelPositionedObject == null) {
      console.log("NULL!");
    }
    return this.playerModelPositionedObject.model;
  }

  getPlayerModelPositionedObject() {
    return this.playerModelPositionedObject;
  }
}
