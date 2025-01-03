class RenderLoopManager {
    /**
     * @param {BABYLON.Engine} engine - The Babylon.js engine.
     * @param {BABYLON.Scene} scene - The Babylon.js scene.
     * @param {Object} velocityManager - Manages object velocities.
     * @param {Object} inputManager - Manages user inputs.
     */
    constructor(engine, scene, velocityManager, inputManager) {
        this.engine = engine;
        this.scene = scene;
        this.velocityManager = velocityManager;
        this.inputManager = inputManager;
        this.renderLoopFunctions = new Set(); // Using a Set to prevent duplicates
        console.log("Constructed render loop manager!");
        this.startRenderLoop();
    }

    /**
     * Adds a function to the render loop.
     * @param {Function} func - Function to add to the render loop.
     */
    addToRenderLoop(func) {
        this.renderLoopFunctions.add(func);
    }

    /**
     * Removes a function from the render loop.
     * @param {Function} func - Function to remove from the render loop.
     */
    removeFromRenderLoop(func) {
        this.renderLoopFunctions.delete(func);
    }

    /**
     * Starts the render loop, centralizing updates for the input manager, velocity manager, and additional functions.
     */
    startRenderLoop() {
            // Call each function in the render loop functions set
            this.renderLoopFunctions.forEach(func => func());

            // Update and render the scene
            if (this.inputManager) this.inputManager.update();
            if (this.velocityManager) this.velocityManager.update();
        });
    }
}
