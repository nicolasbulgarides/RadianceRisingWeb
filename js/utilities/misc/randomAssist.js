class RandomAssist {
  // Returns a random integer between min and max (inclusive)
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Returns a random float between min and max rounded to two decimals
  static getRandomFloat(min, max) {
    const randomValue = Math.random() * (max - min) + min;
    return parseFloat(randomValue.toFixed(2));
  }
}
