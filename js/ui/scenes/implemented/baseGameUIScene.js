/**
 * BaseGameUI
 *
 * This class represents the base UI for the game. It creates interactive GUI components
 * such as the full-screen GUI overlay, game pad, and directional/magic buttons.
 */

/**
 * BaseGameUI
 *
 * This class represents the base UI for the game. It creates interactive GUI components
 * such as the full-screen GUI overlay, game pad, and directional/magic buttons.
 */

class BaseGameUIScene extends UISceneGeneralized {
  constructor() {
    super();
    this.failedUIElements = [];
    this.maxRetryAttempts = 3;
    this.retryDelay = 2000; // 2 second delay between retries
    this.currentFireballEffect = null; // Store the current fireball effect instance
    this.manaBar = null; // Store the mana bar instance
    this.artifactSocketBar = null; // Store the artifact socket bar instance
    this.heartSocketBar = null; // Store the heart socket bar instance
    this.experienceBarSegments = []; // Store experience bar segments
    this.levelNameText = null; // Store level name text control
    this.fpsCounterText = null; // Store FPS counter text control
    this.fpsFrameTimes = []; // Array to store frame times over last 10 seconds
    this.fpsLastUpdateTime = 0; // Last time FPS was calculated
    // Hint system removed - will be implemented differently
  }

  assembleUIGeneralized(aspectRatioPreset) {
    this.currentAspectRatioPreset = aspectRatioPreset;
    this.assembleUIBaseGameUI();
  }

  assembleUIBaseGameUI() {
    // 1) Create the bottom panel background
    this.attemptUIElementLoad(
      () => this.assembleBackBasePanel(),
      "bottomBasePanel"
    );

    // 2) Create the top panel background (symmetrical to bottom)

    this.attemptUIElementLoad(
      () => this.assembleTopBasePanel(),
      "topBasePanel"
    );

    // 3) Create the container that holds all base UI elements
    this.attemptUIElementLoad(
      () => this.assembleUIControlsComposite(),
      "uiControlsComposite"
    );

    // 4) Create the top UI controls container with experience bar and level info
    this.attemptUIElementLoad(
      () => this.assembleTopUIControlsComposite(),
      "topUIControlsComposite"
    );

    console.log("Failed UI elements:", this.failedUIElements);

    // Retry any failed UI elements
    this.retryFailedUIElements();
  }

  rebuildUICompletely() {
    this.advancedTexture.clear();
    // this.assembleUIBaseGameUI();
  }
  /**
   * Creates the bottom panel image that spans 100% width and 24% height.
   */
  assembleBackBasePanel() {
    const bottomBasePanel = new BABYLON.GUI.Image(
      "menuBackground",
      UIAssetManifest.getAssetUrl("uiBasePanel")
    );
    bottomBasePanel.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    bottomBasePanel.width = "100%";
    bottomBasePanel.height = Config.IDEAL_UI_HEIGHT * 0.2 + "px";
    bottomBasePanel.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    // Add the panel to the advancedTexture so it appears behind everything else.
    this.advancedTexture.addControl(bottomBasePanel);

    // Ensure the panel is visible and properly layered
    bottomBasePanel.zIndex = -3; // Ensure it's behind other controls
    bottomBasePanel.alpha = 1; // Ensure full opacity
  }

  /**
   * Creates the top panel image that spans 100% width and 20% height (symmetrical to bottom).
   */
  assembleTopBasePanel() {
    const topBasePanel = new BABYLON.GUI.Image(
      "topMenuBackground",
      UIAssetManifest.getAssetUrl("uiBasePanel")
    );
    topBasePanel.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    topBasePanel.width = "100%";
    topBasePanel.height = Config.IDEAL_UI_HEIGHT * 0.2 + "px";
    topBasePanel.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    // Add the panel to the advancedTexture so it appears behind everything else.
    this.advancedTexture.addControl(topBasePanel);

    // Ensure the panel is visible and properly layered
    topBasePanel.zIndex = -3; // Ensure it's behind other controls
    topBasePanel.alpha = 1; // Ensure full opacity
  }

  /**
   * Assembles the container for the UI controls and adds the D-Pad and other buttons.
   */
  assembleUIControlsComposite() {
    this.createUIControlsContainer();

    // Add the mana bar above the gamepad (must be before gamepad so it appears above)
    this.attemptUIElementLoad(
      () => this.createManaBar(),
      "manaBar"
    );

    // Add the artifact socket bar above the artifact button
    this.attemptUIElementLoad(
      () => this.createArtifactSocketBar(),
      "artifactSocketBar"
    );

    // Add the central game pad
    const dPadContainer = this.createDirectionalGamePadContainer();
    this.addDirectionalButtons(dPadContainer);
    this.addActionButtons(dPadContainer);

    // Optionally handle extra UI per aspect ratio
    this.augmentUIDueToAspectRatioPreset();
  }

  /**
   * Assembles the top UI controls container with experience bar and level info.
   */
  assembleTopUIControlsComposite() {
    this.createTopUIControlsContainer();

    // Add experience bar on the left
    this.attemptUIElementLoad(
      () => this.createTopExperienceBar(),
      "topExperienceBar"
    );

    // Add level name and hint on the right
    this.attemptUIElementLoad(
      () => this.createTopLevelInfo(),
      "topLevelInfo"
    );

    // Add heart socket bar beneath the hint text
    this.attemptUIElementLoad(
      () => this.createTopHeartBar(),
      "topHeartBar"
    );

    // Add FPS counter to the right of hearts
    this.attemptUIElementLoad(
      () => this.createFPSCounter(),
      "fpsCounter"
    );

    // Initialize FPS tracking
    this.initializeFPSTracking();

    // Try to refresh level info from gameplay after a short delay
    // (allows time for level to be loaded)
    setTimeout(() => {
      this.refreshLevelInfoFromGameplay();
    }, 500);

  }

  /**
   * Creates a container at the top 20% of the screen, over the top panel.
   */
  createTopUIControlsContainer() {
    // This container overlays exactly the top 20% of the screen
    this.topUIControlsContainer = new BABYLON.GUI.Container(
      "TopUIControlsContainer"
    );
    this.topUIControlsContainer.width = Config.IDEAL_UI_WIDTH + "px";
    this.topUIControlsContainer.height = Config.IDEAL_UI_HEIGHT * 0.2 + "px";

    // Place this container at the top (matching the top panel)
    this.topUIControlsContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.topUIControlsContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    this.advancedTexture.addControl(this.topUIControlsContainer);
  }

  /**
   * Creates the experience bar on the left side of the top panel.
   */
  createTopExperienceBar() {
    // Calculate size based on UI dimensions (3x larger, then reduced by 30%, then increased by 20%)
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.3024; // 0.252 * 1.2 (20% bigger)

    // Position on the left side of the top panel with 50px left margin
    // Calculate offset: move left from center, then add left margin
    const leftMargin = 50; // Minimum 50px margin from left edge
    const halfBarSize = expBarSize / 2;
    const offsetX = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin; // Left side with margin
    const offsetY = 0; // Centered vertically in top panel

    // Create experience bar base image
    const expBarBase = new BABYLON.GUI.Image(
      "topExpBarBase",
      UIAssetManifest.getAssetUrl("experienceBarBase")
    );
    expBarBase.width = expBarSize + "px";
    expBarBase.height = expBarSize + "px";
    expBarBase.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    expBarBase.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    expBarBase.left = offsetX + "px";
    expBarBase.top = offsetY + "px";
    this.topUIControlsContainer.addControl(expBarBase);

    // Create experience bar segments (24 segments total)
    for (let i = 1; i <= 24; i++) {
      const segmentName = `experienceBar${25 - i}`;
      const expBarSegment = new BABYLON.GUI.Image(
        `topExpBarSegment_${i}`,
        UIAssetManifest.getAssetUrl(segmentName)
      );
      expBarSegment.width = expBarSize + "px";
      expBarSegment.height = expBarSize + "px";
      expBarSegment.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      expBarSegment.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      expBarSegment.left = offsetX + "px";
      expBarSegment.top = offsetY + "px";
      expBarSegment.isVisible = false; // Hidden by default
      expBarSegment.detectPointerOnOpaqueOnly = true;
      this.topUIControlsContainer.addControl(expBarSegment);
      this.experienceBarSegments.push(expBarSegment);
    }
  }

  /**
   * Creates the level name and hint display centered in the space to the right of the experience bar.
   */
  createTopLevelInfo() {
    // Calculate the right edge of the experience bar
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.3024; // Same size as in createTopExperienceBar (20% bigger)
    const leftMargin = 50; // Same margin as in createTopExperienceBar
    const halfBarSize = expBarSize / 2;
    const expBarRightEdge = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin + halfBarSize;

    // Calculate the center of the remaining space on the right
    const rightMargin = 50; // Right margin for symmetry
    const availableRightSpace = (Config.IDEAL_UI_WIDTH / 2) - rightMargin - expBarRightEdge;
    const centerOfRightSpace = expBarRightEdge + (availableRightSpace / 2);

    const levelNameOffsetY = -Config.IDEAL_UI_HEIGHT * 0.02 - 75; // Moved 75 pixels up

    // Create level name text (centered in right space)
    this.levelNameText = new BABYLON.GUI.TextBlock("topLevelName", "Level: Unknown");
    this.levelNameText.color = "white";
    this.levelNameText.fontSize = Config.IDEAL_UI_HEIGHT * 0.028 + "px"; // Reduced by 30% (0.04 * 0.7)
    this.levelNameText.fontFamily = "Arial";
    this.levelNameText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.levelNameText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.levelNameText.left = centerOfRightSpace + "px"; // Centered in right space
    this.levelNameText.top = levelNameOffsetY + "px";
    this.levelNameText.textWrapping = true;
    this.levelNameText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.topUIControlsContainer.addControl(this.levelNameText);
  }

  /**
   * Creates the heart socket bar beneath the level title, centered.
   */
  createTopHeartBar() {
    // Calculate the center of the right space (same as level name position)
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.3024; // 20% bigger experience bar
    const leftMargin = 50;
    const halfBarSize = expBarSize / 2;
    const expBarRightEdge = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin + halfBarSize;
    const rightMargin = 50;
    const availableRightSpace = (Config.IDEAL_UI_WIDTH / 2) - rightMargin - expBarRightEdge;
    const centerOfRightSpace = expBarRightEdge + (availableRightSpace / 2);

    // Position beneath the level title, centered
    const heartBarSize = 125; // 125 pixels tall
    const heartSpacing = 10;
    const totalHeartBarWidth = (heartBarSize * 3) + (heartSpacing * 2);
    const levelNameOffsetY = -Config.IDEAL_UI_HEIGHT * 0.02 - 75; // Same as level name (moved 75px up)
    const heartBarOffsetY = levelNameOffsetY + Config.IDEAL_UI_HEIGHT * 0.05 + (heartBarSize / 2) - 75 + 100; // Below level name with spacing, moved 75px up, then 100px down (50px additional)

    // Center the hearts so they align with the center of the level title
    const heartBarCenterOffsetX = centerOfRightSpace; // Center of heart bar aligns with center of level title

    // Create the heart socket bar with 3 hearts, 100px size
    this.heartSocketBar = new HeartSocketBar(
      "topHeartBar",
      3, // maxHearts (fixed to 3)
      3, // currentHearts (starts full)
      heartBarSize, // heartWidth (100px)
      heartBarSize, // heartHeight (100px)
      heartBarCenterOffsetX, // offsetX (center of heart bar container aligns with center of level title)
      heartBarOffsetY, // offsetY (beneath level title)
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
    );

    // Create the heart socket bar container
    const heartBarContainer = this.heartSocketBar.create();

    // Ensure the container is visible and properly layered
    heartBarContainer.isVisible = true;
    heartBarContainer.zIndex = 10; // Ensure it's above other elements

    // Add to the top UI controls container
    this.topUIControlsContainer.addControl(heartBarContainer);
  }

  /**
   * Creates the FPS counter text to the right of the hearts.
   */
  createFPSCounter() {
    // Calculate position to the right of hearts
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.3024; // Same size as experience bar
    const leftMargin = 50;
    const halfBarSize = expBarSize / 2;
    const expBarRightEdge = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin + halfBarSize;
    const rightMargin = 50;
    const availableRightSpace = (Config.IDEAL_UI_WIDTH / 2) - rightMargin - expBarRightEdge;
    const centerOfRightSpace = expBarRightEdge + (availableRightSpace / 2);

    // Position to the right of hearts (hearts are centered at centerOfRightSpace)
    const heartBarSize = 125;
    const heartSpacing = 10;
    const totalHeartBarWidth = (heartBarSize * 3) + (heartSpacing * 2);
    const levelNameOffsetY = -Config.IDEAL_UI_HEIGHT * 0.02 - 75;
    const heartBarOffsetY = levelNameOffsetY + Config.IDEAL_UI_HEIGHT * 0.05 + (heartBarSize / 2) - 75 + 100;

    // Position FPS counter to the right of hearts
    const fpsOffsetX = centerOfRightSpace + (totalHeartBarWidth / 2) + 30; // 30px spacing from hearts
    const fpsOffsetY = heartBarOffsetY; // Same vertical position as hearts

    // Create FPS counter text
    this.fpsCounterText = new BABYLON.GUI.TextBlock("fpsCounter", "FPS: --");
    this.fpsCounterText.color = "#CCCCCC"; // Light gray color
    this.fpsCounterText.fontSize = Config.IDEAL_UI_HEIGHT * 0.025 + "px";
    this.fpsCounterText.fontFamily = "Arial";
    this.fpsCounterText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.fpsCounterText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.fpsCounterText.left = fpsOffsetX + "px";
    this.fpsCounterText.top = fpsOffsetY + "px";
    this.fpsCounterText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.topUIControlsContainer.addControl(this.fpsCounterText);
  }

  /**
   * Initializes FPS tracking by registering a before render observer.
   */
  initializeFPSTracking() {
    if (!this.advancedTexture || !this.advancedTexture.getScene) {
      // Wait for advanced texture to be ready
      setTimeout(() => this.initializeFPSTracking(), 100);
      return;
    }

    const scene = this.advancedTexture.getScene();
    if (!scene) {
      setTimeout(() => this.initializeFPSTracking(), 100);
      return;
    }

    // Register before render to track FPS
    scene.registerBeforeRender(() => {
      this.updateFPSCounter();
    });
  }

  /**
   * Updates the FPS counter by tracking frame times over the last 10 seconds.
   */
  updateFPSCounter() {
    const currentTime = performance.now();

    // Add current frame time to the array
    if (this.fpsLastUpdateTime > 0) {
      const frameTime = currentTime - this.fpsLastUpdateTime;
      this.fpsFrameTimes.push({
        time: currentTime,
        frameTime: frameTime
      });
    }
    this.fpsLastUpdateTime = currentTime;

    // Remove frame times older than 10 seconds
    const tenSecondsAgo = currentTime - 10000; // 10 seconds in milliseconds
    this.fpsFrameTimes = this.fpsFrameTimes.filter(entry => entry.time >= tenSecondsAgo);

    // Calculate average FPS over the last 10 seconds
    if (this.fpsFrameTimes.length > 0) {
      const totalFrameTime = this.fpsFrameTimes.reduce((sum, entry) => sum + entry.frameTime, 0);
      const averageFrameTime = totalFrameTime / this.fpsFrameTimes.length;
      const averageFPS = averageFrameTime > 0 ? Math.round(1000 / averageFrameTime) : 0;

      // Update the display
      if (this.fpsCounterText) {
        this.fpsCounterText.text = `FPS: ${averageFPS}`;
      }
    } else if (this.fpsCounterText) {
      this.fpsCounterText.text = "FPS: --";
    }
  }

  /**
   * Sets the number of visible segments in the experience bar.
   * @param {number} visibleCount - The count of visible segments (from 0 to 24).
   */
  setExperienceBarSegments(visibleCount) {
    if (!this.experienceBarSegments || this.experienceBarSegments.length === 0) {
      return;
    }
    this.experienceBarSegments.forEach((segment, index) => {
      if (segment) {
        segment.isVisible = index < visibleCount;
      }
    });
  }

  /**
   * Updates the level name display.
   * @param {string} levelName - The level name to display.
   * @param {string} levelHint - The level hint (stored for future use with different system).
   */
  updateLevelInfo(levelName, levelHint) {
    if (this.levelNameText) {
      this.levelNameText.text = levelName ? `Level: ${levelName}` : "Level: Unknown";
    }
    // Hint system removed - will be implemented differently
  }

  /**
   * Automatically updates level info from the active gameplay level.
   * Call this when a level is loaded or when the UI needs to refresh.
   */
  refreshLevelInfoFromGameplay() {
    try {
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
      if (!gameplayManager || !gameplayManager.primaryActiveGameplayLevel) {
        this.updateLevelInfo(null, null);
        return;
      }

      const activeLevel = gameplayManager.primaryActiveGameplayLevel;
      const levelData = activeLevel.levelDataComposite;

      if (!levelData) {
        this.updateLevelInfo(null, null);
        return;
      }

      // Get level name from levelHeaderData or levelNickname property
      let levelName = null;
      if (levelData.levelHeaderData && levelData.levelHeaderData.levelNickname) {
        levelName = levelData.levelHeaderData.levelNickname;
      } else if (levelData.levelNickname) {
        levelName = levelData.levelNickname;
      }

      // Get level hint (stored directly on levelDataComposite)
      const levelHint = levelData.levelHint || null;

      this.updateLevelInfo(levelName, levelHint);
    } catch (error) {
      console.warn("[UI] Failed to refresh level info:", error);
      this.updateLevelInfo(null, null);
    }
  }

  /**
   * Creates a container at the bottom 24% of the screen, over the bottom panel.
   */
  createUIControlsContainer() {
    // This container overlays exactly the bottom 24% of the screen
    this.baseUIControlsContainer = new BABYLON.GUI.Container(
      "BaseUIControlsContainer"
    );
    this.baseUIControlsContainer.width = Config.IDEAL_UI_WIDTH + "px";
    this.baseUIControlsContainer.height = Config.IDEAL_UI_HEIGHT * 0.2 + "px";

    // Place this container at the bottom (matching the bottom panel)
    this.baseUIControlsContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.baseUIControlsContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    this.advancedTexture.addControl(this.baseUIControlsContainer);
  }

  /**
   * Creates and adds the mana bar above the magic button.
   */
  createManaBar() {
    // Calculate socket size based on UI width (proportional to buttons)
    const socketSize = Config.IDEAL_UI_WIDTH * 0.08;

    // Magic button is positioned at: center - (IDEAL_UI_WIDTH * 0.3)
    // So we need to position the mana bar at the same X offset
    const specialButtonXOffset = Config.IDEAL_UI_WIDTH * 0.3;
    const offsetX = -specialButtonXOffset; // Same X position as magic button

    // Calculate vertical position: above the magic button
    // The magic button is centered vertically in the dPadContainer (which is centered in baseUIControlsContainer)
    // Position mana bar above it, accounting for button size and spacing
    const specialButtonSize = Config.IDEAL_UI_WIDTH * 0.15;
    // Use negative offsetY to move up from center (since we're using VERTICAL_ALIGNMENT_CENTER)
    // Space needed: half button height + spacing + half mana bar height
    const offsetY = -(specialButtonSize * 0.5 + socketSize * 0.5 + 15); // 15px spacing between button and mana bar

    // Create the mana bar with 5 max mana (default)
    this.manaBar = new ManaBar(
      "playerManaBar",
      3, // maxMana
      3, // currentMana (starts full)
      socketSize, // socketWidth
      socketSize, // socketHeight
      offsetX, // offsetX (aligned with magic button)
      offsetY, // offsetY (above magic button)
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
    );

    // Create the mana bar container
    const manaBarContainer = this.manaBar.create();

    // Ensure the container is visible and properly layered
    manaBarContainer.isVisible = true;
    manaBarContainer.zIndex = 10; // Ensure it's above other elements

    // Add to the base UI controls container
    this.baseUIControlsContainer.addControl(manaBarContainer);

  }

  /**
   * Creates and adds the artifact socket bar above the artifact button.
   */
  createArtifactSocketBar() {
    // Calculate socket size based on UI width (proportional to buttons)
    const socketSize = Config.IDEAL_UI_WIDTH * 0.08;

    // Artifact button is positioned at: center + (IDEAL_UI_WIDTH * 0.3)
    // So we need to position the artifact socket bar at the same X offset
    const specialButtonXOffset = Config.IDEAL_UI_WIDTH * 0.3;
    const offsetX = specialButtonXOffset; // Same X position as artifact button

    // Calculate vertical position: above the artifact button
    // The artifact button is centered vertically in the dPadContainer (which is centered in baseUIControlsContainer)
    // Position artifact socket bar above it, accounting for button size and spacing
    const specialButtonSize = Config.IDEAL_UI_WIDTH * 0.15;
    // Use negative offsetY to move up from center (since we're using VERTICAL_ALIGNMENT_CENTER)
    // Space needed: half button height + spacing + half artifact bar height
    const offsetY = -(specialButtonSize * 0.5 + socketSize * 0.5 + 15); // 15px spacing between button and artifact bar

    // Create the artifact socket bar with 3 max artifacts (fixed)
    this.artifactSocketBar = new ArtifactSocketBar(
      "playerArtifactBar",
      3, // maxArtifacts (fixed to 3)
      3, // currentArtifacts (starts full)
      socketSize, // socketWidth
      socketSize, // socketHeight
      offsetX, // offsetX (aligned with artifact button)
      offsetY, // offsetY (above artifact button)
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
    );

    // Create the artifact socket bar container
    const artifactBarContainer = this.artifactSocketBar.create();

    // Ensure the container is visible and properly layered
    artifactBarContainer.isVisible = true;
    artifactBarContainer.zIndex = 10; // Ensure it's above other elements

    // Add to the base UI controls container
    this.baseUIControlsContainer.addControl(artifactBarContainer);

  }


  /**
   * Creates the D-Pad container, centers it within the bottom container, and adds the pad image.
   */
  createDirectionalGamePadContainer() {
    const dPadContainer = new BABYLON.GUI.Container("dPadContainer");

    // Give the D-Pad container a fixed "ideal" size and center it.
    dPadContainer.width = Config.IDEAL_UI_WIDTH + "px";
    dPadContainer.height = Config.IDEAL_UI_HEIGHT * 0.2 + "px";
    dPadContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    dPadContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    // Add it to the bottom container
    this.baseUIControlsContainer.addControl(dPadContainer);

    // Add the D-Pad base image
    const gameBasePad = new BABYLON.GUI.Image(
      "gameBasePad",
      UIAssetManifest.getAssetUrl("gamepadBase")
    );
    gameBasePad.width = Config.IDEAL_UI_WIDTH * 0.15 + "px";
    gameBasePad.height = Config.IDEAL_UI_WIDTH * 0.15 + "px";
    gameBasePad.stretch = BABYLON.GUI.Image.STRETCH_NONE;
    dPadContainer.addControl(gameBasePad);

    return dPadContainer;
  }

  /**
   * Adds directional buttons to the provided container with center alignment + manual offset.
   */
  addDirectionalButtons(dPadContainer) {
    const buttonSize = Config.IDEAL_UI_WIDTH * 0.125;
    const symmetricalOffset = Config.IDEAL_UI_WIDTH * 0.1;
    const thickness = 0;

    // We want these to be centered in the container, then offset manually.
    const horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    const verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    const buttons = [
      {
        name: "buttonLeft",
        offsetX: -symmetricalOffset,
        offsetY: 0,
        action: "LEFTCLICK",
      },
      {
        name: "buttonRight",
        offsetX: symmetricalOffset,
        offsetY: 0,
        action: "RIGHTCLICK",
      },
      {
        name: "buttonUp",
        offsetX: 0,
        offsetY: -symmetricalOffset,
        action: "UPCLICK",
      },
      {
        name: "buttonDown",
        offsetX: 0,
        offsetY: symmetricalOffset,
        action: "DOWNCLICK",
      },
    ];

    buttons.forEach((button) => {
      try {
        this.attemptUIElementLoad(() => {
          //  console.log(`Attempting to create button: ${button.name}`);
          const buttonControl = ButtonFactory.createImageButton(
            button.name,
            buttonSize,
            buttonSize,
            thickness,
            button.offsetX,
            button.offsetY,
            horizontalAlignment,
            verticalAlignment,
            this.buttonFunction.bind(this),
            button.action,
            "directionalPadTap"
          );
          if (!buttonControl) {
            throw new Error(
              `Failed to create button control for ${button.name}`
            );
          }
          // console.log(`Successfully created button: ${button.name}`);
          dPadContainer.addControl(buttonControl);
        }, `directionalButton_${button.name}`);
      } catch (error) {
        console.error(
          `Error in button creation process for ${button.name}:`,
          error
        );
        this.failedUIElements.push({
          loadFunction: () =>
            this.attemptUIElementLoad(() => {
              const buttonControl = ButtonFactory.createImageButton(
                button.name,
                buttonSize,
                buttonSize,
                thickness,
                button.offsetX,
                button.offsetY,
                horizontalAlignment,
                verticalAlignment,
                this.buttonFunction.bind(this),
                button.action,
                "directionalPadTap"
              );
              dPadContainer.addControl(buttonControl);
            }, `directionalButton_${button.name}`),
          elementName: `directionalButton_${button.name}`,
          retryCount: 0,
          error: error.message,
          isRateLimitError: error.message && error.message.includes("429"),
        });
      }
    });
  }

  /**
   * Adds special action buttons (e.g., magic and artifact) to the provided container.
   */
  addActionButtons(dPadContainer) {
    const specialButtonSize = Config.IDEAL_UI_WIDTH * 0.15;
    const specialButtonXOffset = Config.IDEAL_UI_WIDTH * 0.3;
    const thickness = 0;
    const horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    const verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    const actionButtons = [
      {
        name: "buttonMagic",
        offsetX: -specialButtonXOffset,
        action: "MAGIC",
      },
      {
        name: "buttonArtifact",
        offsetX: specialButtonXOffset,
        action: "ARTIFACT",
      },
    ];

    actionButtons.forEach((button) => {
      this.attemptUIElementLoad(() => {
        const buttonControl = ButtonFactory.createImageButton(
          button.name,
          specialButtonSize,
          specialButtonSize,
          thickness,
          button.offsetX,
          0,
          horizontalAlignment,
          verticalAlignment,
          this.buttonFunction.bind(this),
          button.action
        );
        dPadContainer.addControl(buttonControl);
      }, `actionButton_${button.name}`);
    });
  }
  /**
   * Handles a button click by routing to the appropriate functionality.
   * @param {string} buttonFunctionKey - The key representing the function of the button.
   */
  buttonFunction(buttonFunctionKey) {
    // Routing movement click to a shared function.
    if (
      buttonFunctionKey === "RIGHTCLICK" ||
      buttonFunctionKey === "LEFTCLICK" ||
      buttonFunctionKey === "UPCLICK" ||
      buttonFunctionKey === "DOWNCLICK"
    ) {
      this.processMovementClick(buttonFunctionKey);
      SoundEffectsManager.playSound("directionalPadTap");
    } else if (buttonFunctionKey === "MAGIC") {
      // Cast spell using mana bar if available
      if (this.manaBar) {
        const spellCast = this.manaBar.castSpell();
        if (spellCast) {
          // Play sound effect for successful spell cast
          SoundEffectsManager.playSound("magicalSpellCastNeutral");
        } else {
          // Play different sound for insufficient mana
          console.log("Insufficient mana to cast spell");
        }
      } else {
        // Fallback: play sound even if mana bar isn't initialized
        SoundEffectsManager.playSound("magicalSpellCastNeutral");
      }
    } else if (buttonFunctionKey === "ARTIFACT") {
      // Use artifact using artifact socket bar if available
      if (this.artifactSocketBar) {
        const artifactUsed = this.artifactSocketBar.useArtifact();
        if (artifactUsed) {
          // Play sound effect for successful artifact usage
          SoundEffectsManager.playSound("artifactUsage");
          // Trigger fireball effect around the player
          this.explosionEffect();
        } else {
          // Play different sound for insufficient artifacts
          console.log("Insufficient artifacts to use");
        }
      } else {
        // Fallback: play sound and trigger effect even if artifact socket bar isn't initialized
        SoundEffectsManager.playSound("artifactUsage");
        this.explosionEffect();
      }
    }
  }

  /**
   * Processes movement button events and forwards the movement direction to the gameplay manager.
   * @param {string} buttonFunction - The function key representing the movement.
   */
  processMovementClick(buttonFunction) {
    const buttonFunctionKey = String(buttonFunction);
    if (FundamentalSystemBridge["gameplayManagerComposite"] != null) {
      let playerDirection = null;

      if (buttonFunctionKey === "LEFTCLICK") {
        playerDirection = "LEFT";
      } else if (buttonFunctionKey === "RIGHTCLICK") {
        playerDirection = "RIGHT";
      } else if (buttonFunctionKey === "UPCLICK") {
        playerDirection = "UP";
      } else if (buttonFunctionKey === "DOWNCLICK") {
        playerDirection = "DOWN";
      }

      // Send the movement direction to the game's logic manager.

      FundamentalSystemBridge[
        "gameplayManagerComposite"
      ].processAttemptedMovementFromUIClick(playerDirection);
    }
  }

  /**
   * Attempts to load a UI element and tracks failures for retry
   * @param {Function} loadFunction - The function that loads the UI element
   * @param {string} elementName - Name of the UI element for tracking
   * @param {number} retryCount - Current retry attempt number
   */
  attemptUIElementLoad(loadFunction, elementName, retryCount = 0) {
    try {
      // console.log(`Attempting to load UI element: ${elementName}`);
      loadFunction();
      // console.log(`Successfully loaded UI element: ${elementName}`);
    } catch (error) {
      //console.warn(`Failed to load UI element: ${elementName}`, error);

      // Check if it's a rate limit error
      const isRateLimitError =
        error.message &&
        (error.message.includes("429") ||
          error.message.includes("Too Many Requests") ||
          error.message.includes("rate limit"));

      if (retryCount < this.maxRetryAttempts) {
        const failedElement = {
          loadFunction,
          elementName,
          retryCount: retryCount + 1,
          error: error.message,
          isRateLimitError,
          timestamp: new Date().toISOString(),
        };
        this.failedUIElements.push(failedElement);
        console.log(`Added to failed elements: ${elementName}`, failedElement);

        // If it's a rate limit error, add a delay before retry
        if (isRateLimitError) {
          console.log(
            `Rate limit hit for ${elementName}, waiting ${this.retryDelay}ms before retry`
          );
          setTimeout(() => {
            this.retryFailedUIElements();
          }, this.retryDelay);
        }
      } else {
        console.error(
          `Failed to load UI element ${elementName} after ${this.maxRetryAttempts} attempts`
        );
      }
    }
  }

  /**
   * Retries loading failed UI elements
   */
  retryFailedUIElements() {
    if (this.failedUIElements.length === 0) return;

    console.log(`Retrying ${this.failedUIElements.length} failed UI elements`);
    const stillFailed = [];

    this.failedUIElements.forEach((element) => {
      try {
        element.loadFunction();
      } catch (error) {
        console.warn(
          `Retry failed for UI element: ${element.elementName}`,
          error
        );

        // Check if it's still a rate limit error
        const isRateLimitError =
          error.message &&
          (error.message.includes("429") ||
            error.message.includes("Too Many Requests") ||
            error.message.includes("rate limit"));

        if (element.retryCount < this.maxRetryAttempts) {
          stillFailed.push({
            ...element,
            retryCount: element.retryCount + 1,
            isRateLimitError,
          });

          // If it's a rate limit error, increase the delay for next retry
          if (isRateLimitError) {
            this.retryDelay *= 1.5; // Increase delay by 50% each time
            console.log(
              `Rate limit still hit for ${element.elementName}, increasing delay to ${this.retryDelay}ms`
            );
          }
        } else {
          console.error(
            `Failed to load UI element ${element.elementName} after ${this.maxRetryAttempts} attempts`
          );
        }
      }
    });

    this.failedUIElements = stillFailed;
  }

  /**
   * Triggers a fireball effect around the player when the artifact button is clicked.
   */
  triggerFireballEffect() {
    console.log("FireballEffect: Trigger function called");

    // Get the game world scene (not the UI scene)
    const gameWorldScene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
    if (!gameWorldScene) {
      console.warn("FireballEffect: Cannot trigger, game world scene not found");
      console.warn("FireballEffect: renderSceneSwapper:", FundamentalSystemBridge["renderSceneSwapper"]);
      return;
    }
    console.log("FireballEffect: Game world scene found:", gameWorldScene);

    // Get the player from the gameplay manager
    const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
    if (!gameplayManager || !gameplayManager.primaryActivePlayer) {
      console.warn("FireballEffect: Cannot trigger, player not found");
      console.warn("FireballEffect: gameplayManager:", gameplayManager);
      console.warn("FireballEffect: primaryActivePlayer:", gameplayManager?.primaryActivePlayer);
      return;
    }

    const player = gameplayManager.primaryActivePlayer;
    console.log("FireballEffect: Player found:", player);

    // Dispose of any existing fireball effect
    if (this.currentFireballEffect) {
      console.log("FireballEffect: Disposing existing effect");
      this.currentFireballEffect.dispose();
      this.currentFireballEffect = null;
    }

    // Create and activate a new fireball effect
    try {
      console.log("FireballEffect: Creating new fireball effect");
      // Calculate fireball size based on player model size
      let fireballRadius = 0.8; // Default larger size
      try {
        const playerMesh = player?.playerMovementManager?.getPlayerModelDirectly();
        if (playerMesh) {
          // Get the bounding box of the player to scale fireball appropriately
          let boundingBox = null;
          if (playerMesh instanceof BABYLON.Mesh) {
            boundingBox = playerMesh.getBoundingInfo()?.boundingBox;
          } else if (playerMesh.meshes && playerMesh.meshes.length > 0) {
            boundingBox = playerMesh.meshes[0].getBoundingInfo()?.boundingBox;
          }

          if (boundingBox) {
            // Make fireball 2x the largest dimension of the player's bounding box
            const size = boundingBox.maximumWorld.subtract(boundingBox.minimumWorld);
            const maxDimension = Math.max(size.x, size.y, size.z);
            console.log("FireballEffect: Player bounding box size:", size, "Fireball radius:", fireballRadius);
          }
        }
      } catch (error) {
        console.warn("FireballEffect: Could not calculate player size, using default:", error);
      }

      this.currentFireballEffect = new FireballEffect2(
        gameWorldScene,
        player,
        {
          radius: fireballRadius * 1.0,
          intensity: 2.0, // Even higher intensity for maximum visibility
          duration: 10000 // 10 seconds - much longer so you can see it
        }
      );
      console.log("FireballEffect: Fireball effect created, activating...");
      this.currentFireballEffect.activate();
      console.log("FireballEffect: Activation complete");
    } catch (error) {
      console.error("FireballEffect: Error creating fireball effect", error);
      console.error("FireballEffect: Error stack:", error.stack);
    }
  }
}
