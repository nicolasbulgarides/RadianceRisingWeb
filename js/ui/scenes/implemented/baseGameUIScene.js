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

// Global debug flags for BaseGameUIScene
const UI_DEBUG = false;
const ARTIFACT_BUTTON_DEBUG = false;
const KEY_USAGE_DEBUG = false;

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
    this.levelText = null; // Store player level text control
    this.fpsCounterText = null; // Store FPS counter text control
    this.perfectionTrackerText = null; // Store perfection tracker text control
    this.fpsFrameCount = 0; // Counter for frames since last update
    this.fpsLastUpdateTime = 0; // Last time FPS was calculated
    this.fpsUpdateInterval = 1000; // Update FPS display every 1 second (1000ms)
    this.fpsCheckCounter = 0; // Counter for frame skipping optimization
    this.perfectionUpdateCounter = 0; // Counter for perfection tracker updates
    // Hint system removed - will be implemented differently
  }

  /**
   * Debug logging method for UI operations
   */
  uiDebugLog(...args) {
    if (UI_DEBUG) {
      console.log("[UI DEBUG]", ...args);
    }
  }

  /**
   * Debug logging method for artifact button operations
   */
  artifactButtonLog(...args) {
    if (ARTIFACT_BUTTON_DEBUG) {
      console.log("[ARTIFACT BUTTON]", ...args);
    }
  }

  /**
   * Debug logging method for key usage operations
   */
  keyUsageLog(...args) {
    if (KEY_USAGE_DEBUG) {
      console.log("[KEY USAGE]", ...args);
    }
  }

  assembleUIGeneralized(aspectRatioPreset) {
    this.currentAspectRatioPreset = aspectRatioPreset;
    this.assembleUIBaseGameUI();
  }

  assembleUIBaseGameUI() {
    // Store global reference for static method access
    window.gameUIInstance = this;

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
    bottomBasePanel.height = (Config.IDEAL_UI_HEIGHT * 0.2 + 50) + "px";
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
    topBasePanel.height = (Config.IDEAL_UI_HEIGHT * 0.2 + 50) + "px";
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
    // Store reference so glowDpadButton() can place overlays on it.
    this.dPadContainer = dPadContainer;
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

    // Add level text below experience bar
    this.attemptUIElementLoad(
      () => this.createTopLevelText(),
      "topLevelText"
    );

    // Add restart button between experience bar and heart sockets
    this.attemptUIElementLoad(
      () => this.createTopRestartButton(),
      "topRestartButton"
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

    // FPS counter disabled - was blocking restart button
    // this.attemptUIElementLoad(
    //   () => this.createFPSCounter(),
    //   "fpsCounter"
    // );

    // Initialize FPS tracking
    // this.initializeFPSTracking();

    // Add level perfection tracker below hearts, aligned with restart button
    this.attemptUIElementLoad(
      () => this.createLevelPerfectionTracker(),
      "levelPerfectionTracker"
    );

    // Add settings button to the top-right of the top panel.
    this.attemptUIElementLoad(
      () => this.createTopSettingsButton(),
      "topSettingsButton"
    );

    // Add hint button directly beneath the settings button.
    this.attemptUIElementLoad(
      () => this.createTopHintButton(),
      "topHintButton"
    );

    // Initialize perfection tracking
    this.initializePerfectionTracking();

    // Try to refresh level info from gameplay after a delay
    // (allows time for level to be loaded)
    setTimeout(() => {
      this.refreshLevelInfoFromGameplay();
    }, 500);

    // Also try after a longer delay in case the level takes longer to load
    setTimeout(() => {
      this.refreshLevelInfoFromGameplay();
    }, 2000);

    // Sync the experience bar with the tracked player status (if available).
    const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
    if (playerStatusTracker instanceof PlayerStatusTracker) {
      playerStatusTracker.updateExperienceUI();
    }

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
    this.topUIControlsContainer.height = (Config.IDEAL_UI_HEIGHT * 0.2 + 50) + "px";

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
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.2024; // 0.252 * 1.2 (20% bigger)

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
   * Creates the player level text below the experience bar.
   */
  createTopLevelText() {
    // Position below the experience bar
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.2024; // Same size as experience bar
    const leftMargin = 50; // Same margin as experience bar
    const halfBarSize = expBarSize / 2;
    const expBarOffsetX = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin;

    // Position below the experience bar
    const expBarOffsetY = 0; // Experience bar is centered
    const levelTextOffsetY = expBarOffsetY + (expBarSize / 2) + 20; // 20px below experience bar (shifted down 10px)

    // Create level text
    this.levelText = new BABYLON.GUI.TextBlock("topLevelText", "Level: 1");
    this.levelText.color = "white";
    this.levelText.fontSize = Config.IDEAL_UI_HEIGHT * 0.025 + "px"; // Slightly smaller than level name
    this.levelText.fontFamily = "Arial";
    this.levelText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.levelText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.levelText.left = expBarOffsetX + "px";
    this.levelText.top = levelTextOffsetY + "px";
    this.levelText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    this.topUIControlsContainer.addControl(this.levelText);
  }

  /**
   * Creates the restart button positioned below the heart socket bar.
   */
  createTopRestartButton() {
    // Calculate position between experience bar and heart bar
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.3024; // Same size as experience bar
    const leftMargin = 50;
    const halfBarSize = expBarSize / 2;
    const expBarRightEdge = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin + halfBarSize;

    // Calculate center of right space (where hearts are positioned)
    const rightMargin = 50;
    const availableRightSpace = (Config.IDEAL_UI_WIDTH / 2) - rightMargin - expBarRightEdge;
    const centerOfRightSpace = expBarRightEdge + (availableRightSpace / 2);

    // Position restart button below the heart socket bar
    const restartButtonSize = 96; // Size for restart button (80 * 1.2 = 20% bigger)
    const heartBarSize = 87.5; // Same size as heart bar
    const levelNameOffsetY = -Config.IDEAL_UI_HEIGHT * 0.02 - 75; // Same as level name
    const heartBarOffsetY = levelNameOffsetY + Config.IDEAL_UI_HEIGHT * 0.05 + (heartBarSize / 2) - 75 + 100;

    // Position restart button below heart bar with spacing, moved 325px to the left (25px less than before)
    const restartOffsetX = centerOfRightSpace - 325; // Center the restart button with the hearts, then move 325px left (25px less)
    const restartOffsetY = heartBarOffsetY + (heartBarSize / 2) + 20; // Below heart bar with 20px spacing (moved down 25px)

    // Create restart button using ButtonFactory
    const restartButtonControl = ButtonFactory.createImageButton(
      "iconRestart",
      restartButtonSize,
      restartButtonSize,
      0, // thickness
      restartOffsetX,
      restartOffsetY,
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
      this.buttonFunction.bind(this),
      "RESTART"
    );

    // Ensure restart button is on top layer (higher z-index than perfection tracker)
    restartButtonControl.zIndex = 100;

    // Add to the top UI controls container
    this.topUIControlsContainer.addControl(restartButtonControl);
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

    const levelNameOffsetY = -Config.IDEAL_UI_HEIGHT * 0.02 - 15; // Moved down 50px (was -65)

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
    // Calculate positioning - move hearts further left (closer to center)
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.3024; // 20% bigger experience bar
    const leftMargin = 50;
    const halfBarSize = expBarSize / 2;
    const expBarRightEdge = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin + halfBarSize;
    const rightMargin = 50;
    const availableRightSpace = (Config.IDEAL_UI_WIDTH / 2) - rightMargin - expBarRightEdge;

    // Position hearts further to the left (use 1/3 of available space instead of 1/2)
    const centerOfRightSpace = expBarRightEdge + (availableRightSpace / 3);

    // Position beneath the level title, centered
    const heartBarSize = 87.5; // Scaled down by 30% from 125px (125 * 0.7)
    const levelNameOffsetY = -Config.IDEAL_UI_HEIGHT * 0.02 - 75; // Same as level name (moved 75px up)
    const heartBarOffsetY = levelNameOffsetY + Config.IDEAL_UI_HEIGHT * 0.05 + (heartBarSize / 2) - 75 + 100; // Below level name with spacing, moved 75px up, then 100px down (50px additional)

    // Center the hearts further to the left
    const heartBarCenterOffsetX = centerOfRightSpace; // Center of heart bar positioned further left

    // Create the heart socket bar with 4 hearts, scaled down size
    this.heartSocketBar = new HeartSocketBar(
      "topHeartBar",
      4, // maxHearts (fixed to 4)
      4, // currentHearts (starts full)
      heartBarSize, // heartWidth (scaled down by 30%)
      heartBarSize, // heartHeight (scaled down by 30%)
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
   * Creates the FPS counter text below the hearts.
   */
  createFPSCounter() {
    // Calculate position below hearts (same center as hearts)
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.3024; // Same size as experience bar
    const leftMargin = 50;
    const halfBarSize = expBarSize / 2;
    const expBarRightEdge = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin + halfBarSize;
    const rightMargin = 50;
    const availableRightSpace = (Config.IDEAL_UI_WIDTH / 2) - rightMargin - expBarRightEdge;
    const centerOfRightSpace = expBarRightEdge + (availableRightSpace / 2);

    // Position below hearts (hearts are centered at centerOfRightSpace)
    const heartBarSize = 125;
    const heartSpacing = 10;
    const levelNameOffsetY = -Config.IDEAL_UI_HEIGHT * 0.02 - 75;
    const heartBarOffsetY = levelNameOffsetY + Config.IDEAL_UI_HEIGHT * 0.05 + (heartBarSize / 2) - 75 + 100;

    // Position FPS counter below hearts, centered
    const fpsOffsetX = centerOfRightSpace; // Centered with hearts
    const fpsOffsetY = heartBarOffsetY + (heartBarSize / 2) + 20; // Below hearts with 20px spacing

    // Create FPS counter text
    this.fpsCounterText = new BABYLON.GUI.TextBlock("fpsCounter", "FPS: --");
    this.fpsCounterText.color = "#CCCCCC"; // Light gray color
    this.fpsCounterText.fontSize = Config.IDEAL_UI_HEIGHT * 0.025 + "px";
    this.fpsCounterText.fontFamily = "Arial";
    this.fpsCounterText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.fpsCounterText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.fpsCounterText.left = fpsOffsetX + "px";
    this.fpsCounterText.top = fpsOffsetY + "px";
    this.fpsCounterText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Centered below hearts
    this.topUIControlsContainer.addControl(this.fpsCounterText);
  }

  /**
   * Creates the level perfection tracker text below the hearts, aligned with restart button.
   */
  createLevelPerfectionTracker() {
    // Position aligned with restart button, below hearts
    const expBarSize = Config.IDEAL_UI_WIDTH * 0.3024; // Same size as experience bar
    const leftMargin = 50;
    const halfBarSize = expBarSize / 2;
    const expBarRightEdge = -(Config.IDEAL_UI_WIDTH / 2) + halfBarSize + leftMargin + halfBarSize;
    const rightMargin = 50;
    const availableRightSpace = (Config.IDEAL_UI_WIDTH / 2) - rightMargin - expBarRightEdge;
    const centerOfRightSpace = expBarRightEdge + (availableRightSpace / 3);

    // Calculate positions (same as restart button)
    const restartButtonSize = 80;
    const heartBarSize = 87.5;
    const levelNameOffsetY = -Config.IDEAL_UI_HEIGHT * 0.02 - 75;
    const heartBarOffsetY = levelNameOffsetY + Config.IDEAL_UI_HEIGHT * 0.05 + (heartBarSize / 2) - 75 + 100;
    const restartOffsetY = heartBarOffsetY + (heartBarSize / 2) + 20;

    // Position perfection tracker below restart button, shifted up 75px and right 300px
    const perfectionOffsetX = centerOfRightSpace - 50; // -150 + 100 = shifted right another 100px
    const perfectionOffsetY = restartOffsetY + restartButtonSize - 65; // -90 + 25 = shifted down 25px

    // Create perfection tracker text
    this.perfectionTrackerText = new BABYLON.GUI.TextBlock("perfectionTracker", "Moves: --/--");
    this.perfectionTrackerText.color = "white"; // Default color
    this.perfectionTrackerText.fontSize = Config.IDEAL_UI_HEIGHT * 0.02 + "px";
    this.perfectionTrackerText.fontFamily = "Arial";
    this.perfectionTrackerText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.perfectionTrackerText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.perfectionTrackerText.left = perfectionOffsetX + "px";
    this.perfectionTrackerText.top = perfectionOffsetY + "px";
    this.perfectionTrackerText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    // Make perfection tracker mouse transparent so clicks pass through to buttons below
    this.perfectionTrackerText.isPointerBlocker = false;
    this.perfectionTrackerText.isHitTestVisible = false;

    this.topUIControlsContainer.addControl(this.perfectionTrackerText);
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
    // Optimized: only check FPS every 4 frames to reduce performance.now() overhead
    scene.registerBeforeRender(() => {
      this.fpsCheckCounter++;
      if (this.fpsCheckCounter % 4 === 0) {
        this.updateFPSCounter();
      }
    });
  }

  /**
   * Initializes perfection tracking by registering updates to track movement progress.
   */
  initializePerfectionTracking() {
    if (!this.advancedTexture || !this.advancedTexture.getScene) {
      // Wait for advanced texture to be ready
      setTimeout(() => this.initializePerfectionTracking(), 100);
      return;
    }

    const scene = this.advancedTexture.getScene();
    if (!scene) {
      setTimeout(() => this.initializePerfectionTracking(), 100);
      return;
    }

    // Register before render to track perfection progress and level name
    this.uiDebugLog(`Registering updatePerfectionTracker to scene: ${scene.name}, scene is UI scene: ${scene === this.advancedTexture?.getScene()}`);
    // Dirty-flag caches — updated only when values change, avoiding redundant work each frame
    this._lastMoveCount = -1;
    this._lastPerfectionLevelId = null;
    this._lastIsInWorldLoader = null;
    let levelNameUpdateCounter = 0;
    scene.registerBeforeRender(() => {
      this.updatePerfectionTracker();
      this.updateUIElementVisibility();

      // Also periodically try to update level name (first few seconds after load)
      levelNameUpdateCounter++;
      if (levelNameUpdateCounter % 60 === 0 && levelNameUpdateCounter < 600) { // Every second for first 10 seconds
        this.refreshLevelInfoFromGameplay();
      }
    });
  }

  /**
   * Updates the level perfection tracker with current movement count and color coding.
   */
  updatePerfectionTracker() {
    if (!this.perfectionTrackerText) {
      return;
    }

    this.perfectionUpdateCounter++;
    // Only log every 60 frames (about once per second at 60fps)
    if (this.perfectionUpdateCounter % 60 === 0) {
      this.uiDebugLog(`updatePerfectionTracker called ${this.perfectionUpdateCounter} times`);
    }

    try {
      // Get current movement count
      const movementTracker = FundamentalSystemBridge["movementTracker"];
      const currentMoves = movementTracker ? movementTracker.realMoveCount : 0;

      // Get current level ID and perfect solution
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
      const activeLevel = gameplayManager?.primaryActiveGameplayLevel;
      const levelId = activeLevel?.levelDataComposite?.levelHeaderData?.levelId ?? null;

      // Skip update if nothing has changed since last render
      if (currentMoves === this._lastMoveCount && levelId === this._lastPerfectionLevelId) return;
      this._lastMoveCount = currentMoves;
      this._lastPerfectionLevelId = levelId;

      if (!gameplayManager || !activeLevel) {
        this.perfectionTrackerText.text = `Moves: ${currentMoves}/--`;
        this.perfectionTrackerText.color = "white";
        return;
      }

      const levelData = activeLevel.levelDataComposite;

      if (!levelData || !levelData.levelHeaderData || !levelId) {
        this.perfectionTrackerText.text = `Moves: ${currentMoves}/--`;
        this.perfectionTrackerText.color = "white";
        return;
      }
      const perfectMoves = LevelProfileManifest.getPerfectSolutionMovementCount(levelId);

      if (perfectMoves === null) {
        this.perfectionTrackerText.text = `Moves: ${currentMoves}/--`;
        this.perfectionTrackerText.color = "white";
        return;
      }

      // Update text
      const newText = `Moves: ${currentMoves}/${perfectMoves}`;
      if (this.perfectionTrackerText.text !== newText) {
        this.uiDebugLog(`Updating perfection tracker text: "${this.perfectionTrackerText.text}" -> "${newText}", isVisible: ${this.perfectionTrackerText.isVisible}, parent: ${this.perfectionTrackerText.parent?.name || 'none'}`);
        this.perfectionTrackerText.text = newText;
      }

      // Set color based on performance
      if (currentMoves <= perfectMoves) {
        // Perfect or better - white
        this.perfectionTrackerText.color = "white";
      } else if (currentMoves <= perfectMoves + 3) {
        // Within 3 moves - orange
        this.perfectionTrackerText.color = "#FFA500"; // Orange
      } else {
        // More than 3 moves over - red
        this.perfectionTrackerText.color = "#FF0000"; // Red
      }

    } catch (error) {
      console.warn("[PERFECTION TRACKER] Error updating tracker:", error);
      this.perfectionTrackerText.text = "Moves: --/--";
      this.perfectionTrackerText.color = "white";
    }
  }

  /**
   * Updates the visibility of UI elements based on the active game scene.
   * Hides level display and move count tracker when in WorldLoaderScene.
   */
  updateUIElementVisibility() {
    const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
    if (!renderSceneSwapper) return;

    const activeGameScene = renderSceneSwapper.getActiveGameLevelScene();
    const isInWorldLoader = activeGameScene && activeGameScene instanceof WorldLoaderScene;

    // Skip all property writes when the scene type hasn't changed
    if (isInWorldLoader === this._lastIsInWorldLoader) return;
    this._lastIsInWorldLoader = isInWorldLoader;

    // Control level name display visibility
    if (this.levelNameText) {
      this.levelNameText.isVisible = !isInWorldLoader;
    }

    // Control level hint display visibility
    if (this.levelHintText) {
      this.levelHintText.isVisible = !isInWorldLoader;
    }

    // Control perfection tracker (move count) visibility
    if (this.perfectionTrackerText) {
      this.perfectionTrackerText.isVisible = !isInWorldLoader;
    }

    // Control heart socket bar visibility
    if (this.heartSocketBar && this.heartSocketBar.container) {
      this.heartSocketBar.container.isVisible = !isInWorldLoader;
    }

    // Control level text visibility and update content
    if (this.levelText) {
      this.levelText.isVisible = !isInWorldLoader;
      if (!isInWorldLoader) {
        this.updateLevelText();
      }
    }
  }

  /**
   * Updates the FPS counter using a high-performance frame counting method.
   * Tracks frames over a 1-second window and updates the display periodically.
   */
  updateFPSCounter() {
    const currentTime = performance.now();

    // Initialize on first call
    if (this.fpsLastUpdateTime === 0) {
      this.fpsLastUpdateTime = currentTime;
      this.fpsFrameCount = 0;
      return;
    }

    // Increment frame counter
    this.fpsFrameCount++;

    // Calculate time elapsed since last update
    const timeElapsed = currentTime - this.fpsLastUpdateTime;

    // Only update display every second (or when interval is reached)
    if (timeElapsed >= this.fpsUpdateInterval) {
      // Calculate FPS: frames / (time in seconds)
      // Multiply by 4 because we only check every 4 frames
      const fps = Math.round((this.fpsFrameCount * 1000 * 4) / timeElapsed);

      // Update the display (removed unnecessary modulo check for performance)
      if (this.fpsCounterText) {
        this.fpsCounterText.text = `FPS: ${fps}`;
      }

      // Reset counters for next measurement period
      this.fpsFrameCount = 0;
      this.fpsLastUpdateTime = currentTime;
    }
  }

  /**
   * Static method to update level name from anywhere in the application
   * This ensures level name updates even if the initial timing is off
   */
  static updateLevelNameGlobally() {
    try {
      // Try to find any BaseGameUIScene instance and call refresh on it
      if (window.gameUIInstance && typeof window.gameUIInstance.refreshLevelInfoFromGameplay === 'function') {
        window.gameUIInstance.refreshLevelInfoFromGameplay();
      } else {
        // Fallback: try to find the level name text control directly
        const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
        if (!renderSceneSwapper) return;

        const activeScene = renderSceneSwapper.getActiveGameLevelScene();
        if (!activeScene) return;

        // Look through all textures in the scene
        activeScene.getChildren().forEach(child => {
          if (child && child.getChildren && typeof child.getChildren === 'function') {
            const controls = child.getChildren();
            controls.forEach(control => {
              if (control && control.name === "topLevelName" && typeof control.text !== 'undefined') {
                // Found the level name text control, update it directly
                try {
                  const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
                  if (gameplayManager && gameplayManager.primaryActiveGameplayLevel) {
                    const activeLevel = gameplayManager.primaryActiveGameplayLevel;
                    const levelData = activeLevel.levelDataComposite;

                    if (levelData && levelData.levelHeaderData && levelData.levelHeaderData.levelId) {
                      control.text = `Level: ${levelData.levelHeaderData.levelId}`;
                    }
                  }
                } catch (error) {
                  console.warn("[UI] Error updating level name control directly:", error);
                }
              }
            });
          }
        });
      }
    } catch (error) {
      console.warn("[UI] Failed to update level name globally:", error);
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

    // Handle level up when experience reaches maximum (24)
    if (visibleCount >= 24) {
      this.handleLevelUp();
      visibleCount = 0; // Reset experience bar to empty after level up
    }

    this.experienceBarSegments.forEach((segment, index) => {
      if (segment) {
        segment.isVisible = index < visibleCount;
      }
    });
  }

  /**
   * Handles level up when experience reaches maximum (24).
   */
  handleLevelUp() {
    // Get the player status tracker to update level
    const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
    if (playerStatusTracker && playerStatusTracker.playerStatus) {
      // Increment level
      playerStatusTracker.playerStatus.currentLevel += 1;

      // Reset experience to 0
      playerStatusTracker.playerStatus.currentExperience = 0;

      // Save changes to localStorage
      playerStatusTracker.saveExperienceToStorage();
      playerStatusTracker.saveLevelToStorage();

      // Update level text display
      this.updateLevelText();

      console.log(`[LEVEL UP] Player leveled up to level ${playerStatusTracker.playerStatus.currentLevel}!`);
    }
  }

  /**
   * Updates the level text display with current player level.
   */
  updateLevelText() {
    if (!this.levelText) return;

    const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
    if (playerStatusTracker && playerStatusTracker.playerStatus) {
      const currentLevel = playerStatusTracker.playerStatus.currentLevel || 1;
      this.levelText.text = `Level: ${currentLevel}`;
    }
  }

  /**
   * Sets the number of hearts displayed in the heart socket bar.
   * @param {number} heartCount - The number of full hearts (from 0 to 3).
   */
  setHeartBarHearts(heartCount) {
    if (!this.heartSocketBar) {
      return;
    }
    this.heartSocketBar.setCurrentHearts(heartCount);
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

      // If level name is not found, try to get level ID from manifest
      if (!levelName && levelData.levelHeaderData && levelData.levelHeaderData.levelId) {
        const levelId = levelData.levelHeaderData.levelId;
        // Use the level ID as the display name
        levelName = levelId;
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
    this.baseUIControlsContainer.height = (Config.IDEAL_UI_HEIGHT * 0.2 + 50) + "px";

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
    dPadContainer.height = (Config.IDEAL_UI_HEIGHT * 0.2 + 50) + "px";
    dPadContainer.top = "10px"; // shift content below panel top edge; taller panel provides bottom clearance
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

    this.attemptUIElementLoad(
      () => this.createSignInButton(dPadContainer),
      "signInButton"
    );
  }

  /**
   * Creates a "Sign in" text button below the artifact button.
   * Visible only when the player is an anonymous guest.
   * Clicking it calls AuthService.upgradeGuestWithGoogle().
   */
  createSignInButton(dPadContainer) {
    const specialButtonSize = Config.IDEAL_UI_WIDTH * 0.15;
    const specialButtonXOffset = Config.IDEAL_UI_WIDTH * 0.3;
    const btnWidth = 130;
    const btnHeight = 26;
    const gap = 8;

    const btn = new BABYLON.GUI.Rectangle("signInButton");
    btn.width = btnWidth + "px";
    btn.height = btnHeight + "px";
    btn.background = "#4285f4";
    btn.color = "transparent";
    btn.thickness = 0;
    btn.cornerRadius = 4;
    btn.left = specialButtonXOffset + "px";
    btn.top = (specialButtonSize / 2 + gap + btnHeight / 2) + "px";
    btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    btn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    const label = new BABYLON.GUI.TextBlock("signInLabel", "Sign in");
    label.color = "#ffffff";
    label.fontSize = 13;
    btn.addControl(label);

    dPadContainer.addControl(btn);
    this.signInButton = btn;

    btn.onPointerClickObservable.add(() => {
      window.AuthService?.triggerGoogleSignIn?.();
    });

    // Set initial visibility and keep it in sync with auth state.
    this._updateSignInButtonVisibility();
    window.AuthService?.onAuthStateChanged?.(() => {
      this._updateSignInButtonVisibility();
    });
  }

  /**
   * Shows the sign-in button only when the current user is an anonymous guest.
   */
  _updateSignInButtonVisibility() {
    if (!this.signInButton) return;
    this.signInButton.isVisible = window.AuthService?.isGuest?.() ?? true;
  }
  /**
   * Creates a small "⚙ Settings" button in the top-right of the top panel.
   * Clicking it dispatches the "radianceOpenSettings" custom event, which
   * SettingsPanel.init() listens for to open the overlay.
   *
   * Placement: topUIControlsContainer is 1000×450px centered.
   *   left = 400px → 100px from right edge
   *   top  = -155px → ~70px from top edge
   */
  createTopSettingsButton() {
    const btn = new BABYLON.GUI.Rectangle("topSettingsButton");
    btn.width               = "126px";
    btn.height              = "42px";
    btn.background          = "#2d1050";
    btn.color               = "#7b4fd4";
    btn.thickness           = 1;
    btn.cornerRadius        = 4;
    btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    btn.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    btn.left                = "400px";
    btn.top                 = "-155px";

    const lbl = new BABYLON.GUI.TextBlock("topSettingsLabel", "\u2699 Settings");
    lbl.color    = "#cccccc";
    lbl.fontSize = 18;
    btn.addControl(lbl);

    this.topUIControlsContainer.addControl(btn);

    btn.onPointerClickObservable.add(() => {
      try {
        window.dispatchEvent(new CustomEvent("radianceOpenSettings"));
      } catch (e) {}
    });
  }

  /**
   * Creates a hint lightbulb button directly beneath the settings button,
   * with a badge showing remaining hint count in the bottom-right corner.
   *
   * Dimensions match the settings button exactly (126×42px).
   * Placement: same left="400px"; top="-107px" positions it 6px below the
   * settings button (which has top="-155px", height=42px).
   */
  createTopHintButton() {
    const btn = new BABYLON.GUI.Rectangle("topHintButton");
    btn.width               = "126px";
    btn.height              = "42px";
    btn.background          = "#2d1050";
    btn.color               = "#7b4fd4";
    btn.thickness           = 1;
    btn.cornerRadius        = 4;
    btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    btn.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    btn.left                = "400px";
    btn.top                 = "-107px";

    // ── GRAPHIC SWAP POINT ────────────────────────────────────────────────────
    // To replace this placeholder with a PNG/sprite icon, swap the TextBlock
    // below for a BABYLON.GUI.Image, for example:
    //   const icon = new BABYLON.GUI.Image("topHintIcon", "path/to/lightbulb.png");
    //   icon.width = "26px"; icon.height = "26px"; btn.addControl(icon);
    const lbl = new BABYLON.GUI.TextBlock("topHintLabel", "\uD83D\uDCA1 Hint");
    // ── END GRAPHIC SWAP POINT ────────────────────────────────────────────────
    lbl.color    = "#cccccc";
    lbl.fontSize = 18;
    btn.addControl(lbl);

    // Badge — small circle overlaid on bottom-right of the button.
    const initialCount = (() => {
      const n = parseInt(localStorage.getItem("radiance_hints") || "3", 10);
      return isNaN(n) ? 3 : n;
    })();
    this.hintBadgeLabel = new BABYLON.GUI.TextBlock("topHintBadgeLabel", initialCount.toString());
    this.hintBadgeLabel.color    = "#ffffff";
    this.hintBadgeLabel.fontSize = 11;

    const badge = new BABYLON.GUI.Rectangle("topHintBadgeBg");
    badge.width               = "20px";
    badge.height              = "20px";
    badge.background          = "#7b4fd4";
    badge.color               = "transparent";
    badge.thickness           = 0;
    badge.cornerRadius        = 10;
    badge.left                = "50px";  // right edge of 126px button, inset 13px
    badge.top                 = "12px";  // bottom edge of 42px button, inset 7px
    badge.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    badge.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    badge.addControl(this.hintBadgeLabel);
    btn.addControl(badge);
    this.hintBadge = badge;

    this.topUIControlsContainer.addControl(btn);

    btn.onPointerClickObservable.add(() => {
      try { window.dispatchEvent(new CustomEvent("radianceRequestHint")); } catch (e) {}
    });

    // Keep badge in sync with HintSystem.
    this._onHintBadgeUpdate = (evt) => {
      if (!this.hintBadgeLabel) return;
      const count = evt.detail?.count ?? 0;
      this.hintBadgeLabel.text  = count.toString();
      this.hintBadge.background = count > 0 ? "#7b4fd4" : "#555555";
    };
    window.addEventListener("radianceHintBadgeUpdate", this._onHintBadgeUpdate);

    // Listen for glow requests from HintSystem.
    this._onGlowDpad = (evt) => {
      this.glowDpadButton(evt.detail?.direction || null);
    };
    window.addEventListener("radianceGlowDpadButton", this._onGlowDpad);
  }

  /**
   * Places a soft purple glow overlay over the specified d-pad button for 3 seconds.
   * Called via the "radianceGlowDpadButton" event dispatched by HintSystem.
   * Pass null to clear any existing glow immediately.
   * @param {string|null} direction — "LEFT" | "RIGHT" | "UP" | "DOWN" | null
   */
  glowDpadButton(direction) {
    // Remove any existing glow overlay.
    if (this._dpadGlowOverlay && this.dPadContainer) {
      try { this.dPadContainer.removeControl(this._dpadGlowOverlay); } catch (e) {}
      this._dpadGlowOverlay = null;
    }

    if (!direction || !this.dPadContainer) return;

    const symmetricalOffset = Config.IDEAL_UI_WIDTH * 0.1;
    const buttonSize        = Config.IDEAL_UI_WIDTH * 0.125;

    const offsets = {
      LEFT:  { x: -symmetricalOffset, y: 0 },
      RIGHT: { x:  symmetricalOffset, y: 0 },
      UP:    { x: 0, y: -symmetricalOffset },
      DOWN:  { x: 0, y:  symmetricalOffset },
    };
    const offset = offsets[direction.toUpperCase()];
    if (!offset) return;

    const glow = new BABYLON.GUI.Rectangle("dpadGlowOverlay");
    glow.width        = (buttonSize + 12) + "px";
    glow.height       = (buttonSize + 12) + "px";
    glow.background   = "#7b4fd4";
    glow.alpha        = 0.45;
    glow.color        = "transparent";
    glow.thickness    = 0;
    glow.cornerRadius = 10;
    glow.left         = offset.x + "px";
    glow.top          = offset.y + "px";
    glow.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    glow.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    glow.isPointerBlocker    = false;
    glow.isHitTestVisible    = false;
    this.dPadContainer.addControl(glow);
    this._dpadGlowOverlay = glow;
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
      // In the world loader scene, magic button cycles constellations instead
      const _rss = FundamentalSystemBridge["renderSceneSwapper"];
      const _activeScene = _rss?.getActiveGameLevelScene();
      if (_activeScene instanceof WorldLoaderScene) {
        _activeScene.onMagicButtonPressed();
        return;
      }
      // Cast spell using mana bar if available
      if (this.manaBar) {
        const spellCast = this.manaBar.castSpell();
        if (spellCast) {
          // Play sound effect for successful spell cast
          SoundEffectsManager.playSound("magicalSpellCastNeutral");
        } else {
          // Play different sound for insufficient mana
          // console.log("Insufficient mana to cast spell");
        }
      } else {
        // Fallback: play sound even if mana bar isn't initialized
        SoundEffectsManager.playSound("magicalSpellCastNeutral");
      }
    } else if (buttonFunctionKey === "ARTIFACT") {
      this.artifactButtonLog("Artifact button clicked");
      // Check if player has a key and is near a lock - if so, unlock the lock
      const lockUnlocked = this.attemptLockUnlocking();
      this.artifactButtonLog(`Lock unlocked: ${lockUnlocked}`);
      if (lockUnlocked) {
        // Lock was unlocked, don't do normal artifact usage
        this.artifactButtonLog("Lock was unlocked, skipping normal artifact usage");
        return;
      }

      // Normal artifact usage (fireball effect)
      // Use artifact using artifact socket bar if available
      if (this.artifactSocketBar) {
        const artifactUsed = this.artifactSocketBar.useArtifact();
        if (artifactUsed) {
          // Play sound effect for successful artifact usage
          SoundEffectsManager.playSound("artifactUsage");
          // Trigger fireball effect around the player
        } else {
          // Play different sound for insufficient artifacts
          //console.log("Insufficient artifacts to use");
        }
      } else {
        // Fallback: play sound and trigger effect even if artifact socket bar isn't initialized
        SoundEffectsManager.playSound("artifactUsage");
      }
    } else if (buttonFunctionKey === "RESTART") {

      // Check if we're in the world loader scene
      const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
      const activeGameScene = renderSceneSwapper?.getActiveGameLevelScene();

      if (activeGameScene && activeGameScene instanceof WorldLoaderScene) {
        // In world loader scene: reset all level completion status, experience granted levels, and player level
        const levelsSolvedStatusTracker = FundamentalSystemBridge["levelsSolvedStatusTracker"];
        if (levelsSolvedStatusTracker) {
          levelsSolvedStatusTracker.resetAllProgress();
          // Also reset experience granted levels to allow re-granting experience
          levelsSolvedStatusTracker.experienceGrantedLevels.clear();
          levelsSolvedStatusTracker.saveExperienceGrantedLevels();

          // Reset player level and experience
          const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
          if (playerStatusTracker && playerStatusTracker.playerStatus) {
            playerStatusTracker.playerStatus.currentLevel = 1;
            playerStatusTracker.playerStatus.currentExperience = 0;
            playerStatusTracker.saveExperienceToStorage();
            playerStatusTracker.saveLevelToStorage();

            // Update UI elements
            if (activeGameScene.updateSphereColor) {
              for (let i = 0; i < 9; i++) {
                activeGameScene.updateSphereColor(i);
              }
            } else {
              console.warn("[RESTART BUTTON] updateSphereColor method not found on activeGameScene");
            }
          }

          SoundEffectsManager.playSound("artifactUsage");
        } else {
          console.error("[RESTART BUTTON] LevelsSolvedStatusTracker not found");
        }
      } else {
        // In gameplay scene: reset current level
        const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
        if (levelResetHandler) {
          levelResetHandler.resetLevel();
          // Play restart sound
          SoundEffectsManager.playSound("artifactUsage"); // Reusing artifact sound for restart
        } else {
          console.error("[RESTART BUTTON] LevelResetHandler not found");
        }
      }
    }
  }

  /**
   * Attempts to unlock a lock if the player has a key and is within 1 tile of a lock.
   * @returns {boolean} True if a lock was unlocked, false otherwise.
   */
  attemptLockUnlocking() {
    const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
    if (!gameplayManager || !gameplayManager.primaryActivePlayer) {
      return false;
    }

    const player = gameplayManager.primaryActivePlayer;
    const activeLevel = gameplayManager.primaryActiveGameplayLevel;

    if (!activeLevel || !player) {
      return false;
    }

    // Check if player has a key
    const inventory = player.mockInventory;
    const keyCount = inventory ? inventory.getItemQuantity("key") : 0;
    if (!inventory || keyCount <= 0) {
      return false;
    }

    // Get player position
    const playerPosition = player.playerMovementManager.currentPosition;
    if (!playerPosition) {
      return false;
    }

    // Find obstacles (including locks)
    let obstacles = [];
    let obstaclesSource = "";
    if (activeLevel.obstacles && Array.isArray(activeLevel.obstacles)) {
      obstacles = activeLevel.obstacles;
      obstaclesSource = "activeLevel.obstacles";
    } else if (activeLevel.levelDataComposite?.obstacles) {
      obstacles = activeLevel.levelDataComposite.obstacles;
      obstaclesSource = "levelDataComposite.obstacles";
    } else if (activeLevel.levelMap?.obstacles) {
      obstacles = activeLevel.levelMap.obstacles;
      obstaclesSource = "levelMap.obstacles";
    }

    // Find locks within 1 tile (adjacent tiles including diagonals)
    const nearbyLocks = obstacles.filter(obstacle => {
      if (!obstacle.isUnlockable || obstacle.obstacleArchetype !== "lock") {
        return false;
      }

      // Get obstacle position (might be in obstacle.position or obstacle.positionedObject.position)
      const obstaclePosition = obstacle.position || (obstacle.positionedObject && obstacle.positionedObject.position);
      if (!obstaclePosition) {
        console.log(`[LOCK UNLOCK] Obstacle has no position:`, obstacle);
        return false;
      }

      // Use tile coordinates for distance calculation (since movement is grid-based)
      const playerTileX = Math.floor(playerPosition.x);
      const playerTileZ = Math.floor(playerPosition.z);
      const lockTileX = Math.floor(obstaclePosition.x);
      const lockTileZ = Math.floor(obstaclePosition.z);

      // Check if lock is within 1 tile (Chebyshev distance <= 1 for grid-based movement)
      const dx = Math.abs(lockTileX - playerTileX);
      const dz = Math.abs(lockTileZ - playerTileZ);
      const distance = Math.max(dx, dz); // Chebyshev distance for grid movement

      return distance <= 1.0;
    });


    if (nearbyLocks.length === 0) {
      return false;
    }

    // Unlock the first nearby lock found
    const lockToUnlock = nearbyLocks[0];
    this.unlockLock(lockToUnlock, activeLevel);

    // Record lock unlock and key usage for replay
    const unlockPosition = lockToUnlock.position || lockToUnlock.positionedObject?.position;
    if (unlockPosition) {
      GameEventBus.emit("gameInteraction", { type: "lock", position: unlockPosition });
      GameEventBus.emit("gameInteraction", { type: "key_usage", position: unlockPosition });
      setTimeout(() => this.updatePerfectionTracker(), 10);
    }

    {
      // Remove key from inventory
      // Note: We don't have a removeItem method, so we'll need to modify the inventory
      // For now, we'll just decrement the count (this is a temporary solution)
      const keyEntry = inventory.inventory.get("key");
      if (keyEntry && keyEntry.quantity > 0) {
        keyEntry.quantity--;
        if (keyEntry.quantity <= 0) {
          inventory.inventory.delete("key");
        }
      }

      // Consume artifact from socket bar
      if (this.artifactSocketBar) {
        this.artifactSocketBar.consumeArtifact(1);
      }

      // Play unlock sound
      const scene = activeLevel.hostingScene;
      if (scene) {
        try {
          SoundEffectsManager.playSound("artifactUsage", scene); // Reusing artifact sound for unlocking
        } catch (error) {
          console.error("Error playing unlock sound:", error);
        }
      }

      const unlockedPosition = lockToUnlock.position || (lockToUnlock.positionedObject && lockToUnlock.positionedObject.position);
      return true;
    }
  }
  /**
   * Unlocks a lock obstacle by removing it from the level and hiding its model.
   * @param {Object} lockObstacle - The lock obstacle to unlock
   * @param {ActiveGameplayLevel} activeLevel - The current level
   */
  unlockLock(lockObstacle, activeLevel) {
    const obstaclePosition = lockObstacle.position || (lockObstacle.positionedObject && lockObstacle.positionedObject.position);

    // Remove lock from ALL obstacle arrays to ensure movement systems can pass through

    // 1. Remove from activeLevel.obstacles
    if (activeLevel.obstacles && Array.isArray(activeLevel.obstacles)) {
      const index = activeLevel.obstacles.indexOf(lockObstacle);
      if (index > -1) {
        activeLevel.obstacles.splice(index, 1);
      }
    }

    // 2. Remove from activeLevel.levelDataComposite.obstacles
    if (activeLevel.levelDataComposite?.obstacles) {
      const index = activeLevel.levelDataComposite.obstacles.indexOf(lockObstacle);
      if (index > -1) {
        activeLevel.levelDataComposite.obstacles.splice(index, 1);
      }
    }

    // 3. Remove from activeLevel.levelMap.obstacles
    if (activeLevel.levelMap?.obstacles) {
      const index = activeLevel.levelMap.obstacles.indexOf(lockObstacle);
      if (index > -1) {
        activeLevel.levelMap.obstacles.splice(index, 1);
      }
    }

    // 4. Remove from activeLevel.levelDataComposite.levelGameplayTraitsData.featuredObjects
    if (activeLevel.levelDataComposite?.levelGameplayTraitsData?.featuredObjects) {
      const featuredObjects = activeLevel.levelDataComposite.levelGameplayTraitsData.featuredObjects;
      const index = featuredObjects.indexOf(lockObstacle);
      if (index > -1) {
        featuredObjects.splice(index, 1);
      }
    }

    // Add passthroughAllowed flag to prevent future obstacle checks (belt and suspenders)
    lockObstacle.passthroughAllowed = true;
    lockObstacle.isObstacle = false;

    // Hide the lock model completely
    if (lockObstacle.positionedObject) {
      // Set a flag to ensure the model gets hidden when it loads (if not loaded yet)
      lockObstacle.positionedObject.shouldBeHidden = true;

      if (lockObstacle.positionedObject.model) {
        const model = lockObstacle.positionedObject.model;

        // Hide the root model
        if (model.isVisible !== undefined) {
          model.isVisible = false;
        }
        if (model.setEnabled) {
          model.setEnabled(false);
        }

        // Hide all child meshes
        if (model.getChildMeshes) {
          const childMeshes = model.getChildMeshes();
          childMeshes.forEach((mesh, i) => {
            if (mesh.isVisible !== undefined) {
              mesh.isVisible = false;
            }
            if (mesh.setEnabled) {
              mesh.setEnabled(false);
            }
          });
        }

        // If model has a meshes array (root node case)
        if (model.meshes && Array.isArray(model.meshes)) {
          model.meshes.forEach((mesh, i) => {
            if (mesh.isVisible !== undefined) {
              mesh.isVisible = false;
            }
            if (mesh.setEnabled) {
              mesh.setEnabled(false);
            }
          });
        }
      } else {
      }
    } else {
      console.warn(`[LOCK UNLOCK] No positionedObject found for lock obstacle`);
    }

    // Trigger orange explosion effect
    this.triggerLockUnlockExplosion(obstaclePosition);
  }

  /**
   * Triggers an orange particle explosion effect at the lock position.
   * @param {BABYLON.Vector3} position - The position of the unlocked lock
   */
  triggerLockUnlockExplosion(position) {
    const effectGenerator = new EffectGenerator();
    effectGenerator.explosionEffect({
      type: 'fire', // Orange/red explosion for lock unlocking
      intensity: 1.2,
      duration: 3.0
    }).catch(error => {
      console.error("Error triggering lock unlock explosion:", error);
    });
  }

  /**
   * Processes movement button events and forwards the movement direction to the gameplay manager.
   * @param {string} buttonFunction - The function key representing the movement.
   */
  processMovementClick(buttonFunction) {
    const buttonFunctionKey = String(buttonFunction);

    if (FundamentalSystemBridge["gameplayManagerComposite"] != null) {
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];

      // Check if we have a fully loaded level with a player
      if (!gameplayManager.primaryActiveGameplayLevel || !gameplayManager.primaryActiveGameplayLevel.currentPrimaryPlayer) {
        console.log("[UI] Movement input blocked - level or player not fully loaded");
        return;
      }

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

    if (this.failedUIElements.length > 0) {
      console.log(`Retrying ${this.failedUIElements.length} failed UI elements`);
    }
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

}
