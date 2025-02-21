/**
 * Represents the calculated transformation changes for a single animation frame.
 * Contains vectors for position, rotation, and scale shifts to be applied
 * to animated objects.
 */
class ProgrammaticFrameShift {
  constructor(positionShiftVector, rotationShiftVector, scaleShiftVector) {
    this.positionShiftVector = positionShiftVector;
    this.rotationShiftVector = rotationShiftVector;
    this.scaleShiftVector = scaleShiftVector;
  }
}
