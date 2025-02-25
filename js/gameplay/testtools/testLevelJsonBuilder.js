class TestLevelJsonBuilder {
  static buildTestLevelJsonComposite() {
    let header = TestLevelJsonBuilder.getTestLevelHeaderDataConfigureMe();

    let levelHeaderData = TestLevelJsonBuilder.buildHeaderData(
      header[0],
      header[1],
      header[2]
    );

    let gameplayTraits = TestLevelJsonBuilder.buildGameplayTraits();
  }

  static getTestLevelHeaderDataConfigureMe() {
    let levelIdToMake = "testLevel0";
    let levelNicknameToMake = "Test Level 0";
    let levelCategoryToMake = "developer";

    let headerValues = [
      levelIdToMake,
      levelNicknameToMake,
      levelCategoryToMake,
    ];

    return headerValues;
  }

  static buildHeaderData(id, nickname, category) {
    let isDeveloperLevel = true;
    let isTutoriallevel = false;
    let isLocalLevel = true;
    let isFreeLevel = true;
    let isPremiumLevel = false;

    return new LevelProfileHeader(
      id,
      nickname,
      category,
      isDeveloperLevel,
      isTutoriallevel,
      isLocalLevel,
      isFreeLevel,
      isPremiumLevel
    );
  }
}
