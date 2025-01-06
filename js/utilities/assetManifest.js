class AssetManifest {
  /**
   * Retrieves the URL for a given asset name.
   * @param {string} assetName - The name of the asset.
   * @returns {string|null} - The URL of the asset, or null if not found.
   */
  static getAssetUrl(assetName) {
    return this.assets[assetName] || null;
  }

  // Asset manifest data
  static assets = {
    archwayPillarLeftPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/archwayPillarLeftPre.glb",
    archwayPillarRightPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/archwayPillarRightPre.glb",
    archwayPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/archwayPre.glb",
    ascensionNebula:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/ascensionNebula.png",
    bagPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/bagPre.glb",
    bridgeBentPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/bridgeBentPre.glb",
    bridgeBorkenPiecePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/bridgeBorkenPiecePre.glb",
    bridgeBrokenPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/bridgeBrokenPre.glb",
    bridgeWholePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/bridgeWholeCompressedTest.glb",
    celestialPrismPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/celestialPrismPre.glb",
    cube: "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/cube2.glb",
    doorClosedPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/doorClosedPre.glb",
    doorFramePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/doorFramePre.glb",
    doorLeftPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/doorLeftPre.glb",
    doorOpenPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/doorOpenPre.glb",
    doorRightPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/doorRightPre.glb",
    keyPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/keyPre.glb",
    levelLarge:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/levelLarge.glb",
    leverBasePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/leverBasePre.glb",
    leverHandlePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/leverHandlePre.glb",
    leverWholePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/leverWholePre.glb",
    leverWholeP1Pre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/leverWholePre.glb",
    lotusPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/lotusPre.glb",
    purpleNoteBig:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/purpleNoteBig.glb",
    purpleNoteMini:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/purpleNoteMini.glb",
    rotatingLeverPre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/rotatingLeverPre.glb",
    rotatingLeverBasePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/ratatingLeverBasePre.glb",
    rotatingLeverWholePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/rotatingLeverWholePre.glb",
    running:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/running.glb",
    spaceSky:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/spaceSky.glb",
    spaceSky2:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/spaceSky2.glb",
    spaceSky3:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/spaceSky3.glb",
    stainedSunShield:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/stainedSunShield.png",
    statue:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/statue.glb",
    tile1Pre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile1Pre.glb",
    tile2Pre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile2Pre.glb",
    tile3Pre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile3Pre.glb",
    tile4Pre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile4Pre.glb",
    tile5Pre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile5Pre.glb",
    tile6Pre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/tile6Pre.glb",
    wallFramePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/wallFramePre.glb",
    wallInsidePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/wallInsidePre.glb",
    wallWholePre:
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/wallWholePre.glb",
  };
}

// Export AssetManifest class globally
window.AssetManifest = AssetManifest;
