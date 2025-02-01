class ChadUtilities {
  static describeVector(msg, vector) {
    console.log(
      "MSG: " +
        msg +
        " , Vector: X: " +
        vector.x +
        " , y: " +
        vector.y +
        " , Z: " +
        vector.z
    );
  }
  static describePositionedObject(msg, object) {
    console.log(
      "MSG: " +
        msg +
        ", model: " +
        object.modelId +
        " , Vector: X: " +
        object.position.x +
        " , y: " +
        object.position.y +
        " , Z: " +
        object.position.y
    );
  }
}
