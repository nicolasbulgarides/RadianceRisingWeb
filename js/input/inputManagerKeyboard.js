class InputManager {
    constructor(onMoveObservable) {
        this.onMoveObservable = onMoveObservable;
        this.movement = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,    // For Space key (up on Y-axis)
            down: false   // For Shift key (down on Y-axis)
        };
        this.resetVelocity = false; // Flag for clearing velocity
        this.setupInputListeners();
    }

    // Setup keydown and keyup listeners for movement
    setupInputListeners() {
        window.addEventListener("keydown", (event) => this.onKeyChange(event, true));
        window.addEventListener("keyup", (event) => this.onKeyChange(event, false));
    }

    // Handle key changes and calculate direction
    onKeyChange(event, isKeyDown) {
        switch (event.key.toLowerCase()) {
            case "w":
                this.movement.forward = isKeyDown;
                break;
            case "s":
                this.movement.backward = isKeyDown;
                break;
            case "a":
                this.movement.left = isKeyDown;
                break;
            case "d":
                this.movement.right = isKeyDown;
                break;
            case " ":
                this.movement.up = isKeyDown;  // Space key for moving up on Y-axis
                break;
            case "shift":
                this.movement.down = isKeyDown; // Shift key for moving down on Y-axis
                break;
            case "c":
                if (isKeyDown) {
                    this.resetVelocity = true;  // Set reset flag when "C" is pressed
                }
                break;
        }

        // Emit the movement direction to the observable
        this.emitMovementDirection();
    }

    emitMovementDirection() {
        // Initialize direction vector components
        let x = 0;
        let y = 0;
        let z = 0;

        // Determine horizontal movement
        if (this.movement.right) x += 1;
        if (this.movement.left) x -= 1;

        // Determine forward/backward movement
        if (this.movement.forward) z += 1;
        if (this.movement.backward) z -= 1;

        // Determine up/down movement
        if (this.movement.up) y += 1;
        if (this.movement.down) y -= 1;

        // Create a direction vector from the calculated x, y, and z components
        // Normalize the direction vector to ensure consistent speed
          const direction = new BABYLON.Vector3(x, y, z);
          if (direction && typeof direction.length() === "function" && direction.length() > 0) {
              direction.normalize();
              window.Logger.log("Normalizing!");
          }
        // Notify observers with the calculated direction vector and reset flag
        this.onMoveObservable.notifyObservers({ direction, resetVelocity: this.resetVelocity });

        // Reset the resetVelocity flag after notifying observers
        this.resetVelocity = false;
    }
}
