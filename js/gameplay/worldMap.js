class WorldMap {
  constructor(width, depth) {
    this.width = width;
    this.depth = depth;
    initialize();
  }

  initialize() {
    this.boardSlots = []; // Add this line to store grid slots
    this.boardSlots = new Array(width);
    for (let x = 0; x < width; x++) {
      this.boardSlots[x] = new Array(depth);
    }
  }
}
