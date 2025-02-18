class CatastropheManager {
  static registeredCatastrophes = [
    "This list shows all registed catastrophic errors.",
  ];

  static registerCatastrophe(catastrophe) {
    this.registeredCatastrophes.push(catastrophe);
  }

  static displayCatastrophePage() {
    // window.location.href = "catastropheReport.html";
  }

  static logCatastrophe(catastrophe) {
    console.error(catastrophe);
  }
  static reportCatastrophesToDeveloper() {}

  static getCatastrophicErrors() {
    return this.registeredCatastrophes;
  }
}
