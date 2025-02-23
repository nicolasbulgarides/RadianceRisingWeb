class VectorAssist {
  /**
   * Utility method to calculate destination by adding shift to start position
   * @param {BABYLON.Vector3} startVector - Starting position
   * @param {BABYLON.Vector3} shiftVector - Amount to shift by
   * @returns {BABYLON.Vector3} The resulting destination vector
   */
  static getDeterminedDestinationVector(startVector, shiftVector) {
    return new BABYLON.Vector3(
      startVector.x + shiftVector.x,
      startVector.y + shiftVector.y,
      startVector.z + shiftVector.z
    );
  }

  /**
   * Utility method to create a shift vector
   * @param {number} x - X component of shift
   * @param {number} y - Y component of shift
   * @param {number} z - Z component of shift
   * @returns {BABYLON.Vector3} The shift vector
   */
  static getArbitraryShiftVector(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }

  /**
   * Utility method to create a destination vector
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} z - Z coordinate
   * @returns {BABYLON.Vector3} The destination vector
   */
  static getArbitraryDestinationVector(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }
}
