class AssetManifest {
  /**
   * Retrieves the URL for a given asset name.
   * @param {string} assetName - The name of the asset.
   * @returns {string|null} - The URL of the asset, or null if not found.
   */
  static getAssetUrl(assetName) {
    return this.assets[assetName] || null;
  }

  // Asset manifest data (3D objects only)
  static assets = {
    animatedSphere:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/animatedSphere.glb",
    spaceSky1:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/spaceSky.glb",
    spaceSky2:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/spaceSky2.glb",
    spaceSky3:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/spaceSky3.glb",
    purpleNoteMini:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/purpleNoteMini.glb",
    redNoteBig:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/redNoteBig.glb",
    redNoteMini:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/redNoteMini.glb",
    spaceSky2:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/spaceSky2.glb",
    spaceSky3:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/spaceSky3.glb",
    testBoulder:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testBoulder.glb",
    testBowCrystal:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testBowCrystal.glb",
    testCloudBlue:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testCloudBlue.glb",
    testCloudWhite:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testCloudWhite.glb",
    testDoorway:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testDoorway.glb",
    testFire:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testFire.glb",
    testFlower:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testFlower.glb",
    testGlassArch:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testGlassArchway.glb",
    testGlassBridge:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testGlassBridge.glb",
    testGlassDoor:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testGlassDoor.glb",
    testTile1:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile6Clone1.glb",
    testTile2:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile6Clone2.glb",
    testTile3:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile6Clone3.glb",
    testTile4:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile6Clone4.glb",
    testTile5:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile6Clone5.glb",
    testTile6:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile6Clone6.glb",
    testTilePure:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testTile2.glb",
    testGoddess2PinkLotusLarge:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testGoddess2PinkLotusLarge.glb",
    testGoddess2PinkLotusSmall:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testGoddess2PinkLotusSmall.glb",
    testGoddessPinkLotus:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testGoddessPinkLotus.glb",
    testHand:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testHand.glb",
    testHeartRed:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testHeartRed.glb",
    testHourglassOrange:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testHourglassOrange.glb",
    testLock:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testLock.glb",
    testLore:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testLore.glb",
    testMango:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testMango.glb",
    testMaskRainbow:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testMaskRainbow.glb",
    testMoonSilver:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testMoonSilver.glb",
    testMountain:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testMountain.glb",
    testQuestion:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testQuestion.glb",
    testRefreshRainbow:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testRefreshRainbow.glb",
    testSpiral:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testSpiral.glb",
    testStarRainbow:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testStarRainbow.glb",
    testStarSpike:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testStarSpike.glb",
    testTree:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testTree.glb",
    testTrumpetAmethyst:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testTrumpetAmethyst.glb",
    testTrumpetSapphire:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/testTrumpetSapphire.glb",
  };
}

// Export AssetManifest class globally
window.AssetManifest = AssetManifest;
