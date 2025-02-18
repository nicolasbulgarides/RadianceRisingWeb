class SequenceManager {
  constructor() {
    this.loadGameInitializationSequence();
  }

  loadGameInitializationSequence() {
    // this.loadNetworkingManager();
    //his.loadTransactionManager();
    //  this.loadPlayerSaveManager();
    // this.loadAbilityManager();
    this.loadSceneSystems();
    this.loadGameplayManager();

    let successfulNetworkLoad =
      this.networkingManager.attemptToLoadPlayerSaveComposite();

    if (successfulNetworkLoad) {
      let playerSaveComposite =
        this.networkingManager.retrieveSuccessfulPlayerSaveLoad();

      if (playerSaveComposite instanceof PlayerSaveComposite) {
        if (playerSaveComposite.verifyCompletePlayerSave()) {
          this.loadGameEnvironmentBasedOffPlayerSaveComposite(
            playerSaveComposite
          );
        }
      }
    }
  }

  loadNetworkingManager() {
    this.networkingManager = new NetworkingManager();
    SystemBridge.registerNetworkingManager(this.networkingManager);
  }

  loadTransactionManager() {
    this.transactionManager = new TransactionManager();
    SystemBridge.registerTransactionManager(this.transactionManager);
  }
  loadPlayerSaveManager() {
    this.playerSaveManager = new PlayerSaveManager();
    SystemBridge.registerPlayerSaveManager(this.playerSaveManager);
  }

  loadAbilityManager() {
    this.abilityManager = new AbilityManager();
    SystemBridge.registerAbilityManager(this.abilityManager);
  }
  loadGameplayManager() {
    this.gameplayManager = new GameplayManager();
    SystemBridge.registerGameplayManager(this.gameplayManager);
  }

  loadSceneSystems() {
    return;
    /** 
    if (SystemBridge.babylonEngine instanceof BABYLON.Engine) {
      this.sceneSwapper = new RenderSceneSwapper(SystemBridge.babylonEngine);
      SystemBridge.registerSceneSwapper(this.sceneSwapper);
      this.sceneSwapper.initializeFundamentalTestingScene();
    } else {
    
    }
    */
  }
}
