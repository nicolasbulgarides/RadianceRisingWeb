class PlayerPositionAndModelManager {
  constructor(playerModelObject, position) {
    this.playerModelPositionedObject = playerModelObject;

    this.currentPosition = position;
    this.pathingDestination = null;
    console.log(
      "Player initialized too: " + this.currentPosition.x + " , " + this,
      this.currentPosition.y + " ,  " + this.currentPosition.z
    );
  }
  setCurrentPathingDestination(destination) {
    this.pathingDestination = destination;
  }

  getPositionVector() {
    return this.currentPosition;
  }
  // Update position
  setPositionNoMotion(positionVector) {
    this.currentPosition = positionVector;
  }

  adjustPositionNoMotion(adjustmentVector) {
    this.currentPosition = new BABYLON.Vector3(
      adjustmentVector.x + this.currentPosition.x,
      adjustmentVector.y + this.currentPosition.y,
      adjustmentVector.z + this.currentPosition.z
    );
  }

  adjustPositionRelocateModelInstantly(adjustmentVector) {
    this.adjustPositionNoMotion(djustmentVector);
    this.relocateToCurrentPositionInstantly;
  }

  setPositionRelocateModelInstantly(positionVector) {
    this.setPositionNoMotion(positionVector);
    this.relocateToCurrentPositionInstantly;
  }

  relocateToCurrentPositionInstantly() {
    this.playerModelPositionedObject.setPosition(this.currentPosition);
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
