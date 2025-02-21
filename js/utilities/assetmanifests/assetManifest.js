/**
 * AssetManifest manages the mapping of asset keys to their file names and provides URLs for loading assets.
 * It contains base URLs for asset delivery and a collection of asset file mappings.
 */
class AssetManifest {
  // Base path to all your models/env files:
  static baseUrl = "https://radianceloader.nicolasbulgarides.workers.dev/";
  static githubUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/";

  // Map from a friendly key => actual file name in GitHub
  static assets = {
    animatedSphere: "animatedSphere.glb",
    archway: "archway.glb",
    archwayPillar: "archwayPillar.glb",
    archwayTop: "archwayTop.glb",
    bag: "bag.glb",
    breakableWallFrame: "breakableWallFrame.glb",
    breakableWallInside: "breakableWallInside.glb",
    breakableWallWhole: "breakableWallWhole.glb",
    bridgeBent: "bridgeBent.glb",
    bridgeBroken: "bridgeBroken.glb",
    bridgeBrokenPiece: "bridgeBrokenPiece.glb",
    bridgeWhole: "bridgeWhole.glb",
    bridgeWholePre: "bridgeWholePre.glb",
    celestialPrism: "celestialPrism.glb",
    celestialPrism_innerRing1: "celestialPrism_innerRing001.glb",
    celestialPrism_innerRing2: "celestialPrism_innerRing002.glb",
    celestialPrism_innerRing3: "celestialPrism_innerRing003.glb",
    celestialPrism_innerRing4: "celestialPrism_innerRing004.glb",
    celestialPrism_outerRing: "celestialPrism_outerRing.glb",
    celestialPrism_sphere: "celestialPrism_sphere.glb",
    cube: "cube.glb",
    doorClosed: "doorClosed.glb",
    doorFrame: "doorFrame.glb",
    doorLeft: "doorLeft.glb",
    doorOpen: "doorOpen.glb",
    doorRight: "doorRight.glb",
    key: "key.glb",
    leverBase: "leverBase_lowPoly_lowPoly.glb",
    leverHandle: "leverHandle_lowPoly_lowPoly.glb",
    leverWholeP1: "leverWholeP1_lowPoly_lowPoly.glb",
    leverWholeP2: "leverWholeP2_lowPoly_lowPoly.glb",
    leverWholeP3: "leverWholeP3_lowPoly_lowPoly.glb",
    lotus: "lotus.glb",
    pendant_lowPoly: "pendant_lowPoly.glb",
    purpleNoteBig: "purpleNoteBig.glb",
    purpleNoteMini: "purpleNoteMini.glb",
    redCastle: "redCastle.glb",
    redNoteBig: "redNoteBig.glb",
    redNoteMini: "redNoteMini.glb",
    rotatingLeverBase_lowPoly: "rotatingLeverBase_lowPoly.glb",
    rotatingLeverHandle_lowPoly: "rotatingLeverHandle_lowPoly.glb",
    rotatingLeverWhole_lowPoly: "rotatingLeverWhole_lowPoly.glb",
    running: "running.glb",
    spaceSky: "spaceSky.glb",
    spaceSky2: "spaceSky2.glb",
    spaceSky3: "spaceSky3.glb",
    sphereModelTest: "sphereModelTest.glb",
    testBoulder: "testBoulder.glb",
    testBowCrystal: "testBowCrystal.glb",
    testCloudBlue: "testCloudBlue.glb",
    testCloudWhite: "testCloudWhite.glb",
    testCloudWhite2: "testCloudWhite2.glb",
    testCubeGildedVoid: "testCubeGildedVoid.glb",
    testDoorway: "testDoorway.glb",
    testElectricSwitch: "testElectricSwitch.glb",
    testExport: "testExport.glb",
    testFire: "testFire.glb",
    testFlower: "testFlower.glb",
    testGateway: "testGateway.glb",
    testGlassArchway: "testGlassArchway.glb",
    testGlassBridge: "testGlassBridge.glb",
    testGlassDoor: "testGlassDoor.glb",
    testGlassKey: "testGlassKey.glb",
    testGlassTile: "testGlassTile.glb",
    testGlassTreasureChest: "testGlassTreasureChest.glb",
    testGoddess2PinkLotusLarge: "testGoddess2PinkLotusLarge.glb",
    testGoddess2PinkLotusSmall: "testGoddess2PinkLotusSmall.glb",
    testGoddessPinkLotusLarge: "testGoddessPinkLotusLarge.glb",
    testGoddessPinkLotusSmall: "testGoddessPinkLotusSmall.glb",
    testHairbowCrystalBlue: "testHairbowCrystalBlue.glb",
    testHand: "testHand.glb",
    testHeartRed: "testHeartRed.glb",
    testHourglassOrange: "testHourglassOrange.glb",
    testLock: "testLock.glb",
    testLore: "testLore.glb",
    testLotusPink: "testLotusPink.glb",
    testMango: "testMango.glb",
    testMaskRainbow: "testMaskRainbow.glb",
    testMoonSilver: "testMoonSilver.glb",
    testMountain: "testMountain.glb",
    testQuestion: "testQuestion.glb",
    testRefreshRainbow: "testRefreshRainbow.glb",
    testSphereStarBlue: "testSphereStarBlue.glb",
    testSphereStarFloral: "testSphereStarFloral.glb",
    testSphereStarPurple: "testSphereStarPurple.glb",
    testSphereStarRed: "testSphereStarRed.glb",
    testSphereStarSilver: "testSphereStarSilver.glb",
    testSphereUnit: "testSphereUnit.glb",
    testSphereUnit2: "testSphereUnit2.glb",
    testSpiral: "testSpiral.glb",
    testStarRainbow: "testStarRainbow.glb",
    testStarSpike: "testStarSpike.glb",
    testTree: "testTree.glb",
    testTrumpetAmethyst: "testTrumpetAmethyst.glb",
    testVeenaSapphire: "testVeenaSapphire.glb",
    testVailEmerald: "testVailEmerald.glb",
    mechaSphereBronzeLowRes: "mechaSphereBronzeLowRes.glb",
    mechaSphereLowPolygonBronze: "mechaSphereLowPolygonBronze.glb",
    mechaSphereLowPolygonPink: "mechaSphereLowPolygonPink.glb",
    mechaSphereLowPolygonPurple: "mechaSphereLowPolygonPurple.glb",
    sphereNew_emissive: "sphereNew_emissive.glb",
    sphereNew_galaxy100m: "sphereNew_galaxy100m.glb",
    sphereNew_galaxy250m: "sphereNew_galaxy250m.glb",
    sphereNew_galaxy500m: "sphereNew_galaxy500m.glb",
    sphereNew_galaxy1000m: "sphereNew_galaxy1000m.glb",
    sphereNew_galaxy2500m: "sphereNew_galaxy2500m.glb",
    sphereNew_galaxy5000m: "sphereNew_galaxy5000m.glb",
    sphereNew_transmissiveClear: "sphereNew_transmissiveClear.glb",
    sphereNew_transmissiveStainedGlass:
      "sphereNew_transmissiveStainedGlass.glb",
    chest1: "chest1.glb",
    chest2: "chest2.glb",
    chest3: "chest3.glb",
    chest4: "chest4.glb",
    key1: "key1.glb",
    key2: "key2.glb",
    key3: "key3.glb",
    key4: "key4.glb",

    tile1: "tile1Compressed.glb",
    tile2: "tile2Compressed.glb",
    tile3: "tile3Compressed.glb",
    tile4: "tile4Compressed.glb",
    tile5: "tile5Compressed.glb",
    tile6: "tile6Compressed.glb",
    mechaSphereBlueBase: "mechaSphereBlueBase.glb",
  };

  /**
   * Retrieves the URL for a given asset name.
   * Depending on the environment (local or production), it returns the URL from either GitHub or the worker server.
   * Now, if the asset file name contains "test", it prepends "test/" to the filename.
   * @param {string} assetName - The key used to look up the asset (e.g. "archway").
   * @returns {string|null} - The full URL of the asset, or null if not found.
   */
  static getAssetUrl(assetName) {
    let fileName = this.assets[assetName];
    // If the asset file name contains "test", prepend "test/"
    if (fileName && fileName.includes("test")) fileName = "test/" + fileName;
    if (Config.finalizeLocalDetermination) {
      return fileName ? `${this.githubUrl}${fileName}` : null;
    } else {
      return fileName ? `${this.baseUrl}${fileName}` : null;
    }
  }
}

// Optionally expose the class globally (if your setup requires it)
window.AssetManifest = AssetManifest;
