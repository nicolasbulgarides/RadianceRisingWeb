/**
 * Class InputManager
 * ------------------
 * Manages keyboard input to control movement in a BabylonJS-based puzzle game.
 * Listens for key events and emits a normalized movement direction via an observable.
 * 
 * Movement flags:
 * - forward/backward: "W" and "S"
 * - left/right: "A" and "D"
 * - up/down: Space (up) and Shift (down)
 * 
 * Additional functionality:
 * - Pressing "C" sets a flag to reset the object's velocity.
 */
class InputManager {
    /**
     * Creates an instance of InputManager.
     * @param {BABYLON.Observable} onMoveObservable - Observable that notifies subscribers with movement data.
     */
    constructor(onMoveObservable) {
        // Observable used to dispatch updated movement vectors and reset flags.
        this.onMoveObservable = onMoveObservable;

        // Object storing current movement state for each direction.
        this.movement = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,    // Space key: move up on Y-axis.
            down: false   // Shift key: move down on Y-axis.
        };

        // Flag indicating that velocity reset was triggered by key press.
        this.resetVelocity = false;

        // Initialize keyboard input listeners.
        this.setupInputListeners();
    }

    /**
     * Registers event listeners for keydown and keyup events.
     * Calls onKeyChange to update movement flags and emit changes.
     */
    setupInputListeners() {
        // Listen for key press events.
        window.addEventListener("keydown", (event) => this.onKeyChange(event, true));
        // Listen for key release events.
        window.addEventListener("keyup", (event) => this.onKeyChange(event, false));
    }

    /**
     * Handles updates to the movement state when a key is pressed or released.
     * Sets the velocity reset flag when "C" is pressed.
     *
     * @param {KeyboardEvent} event - The keyboard event.
     * @param {boolean} isKeyDown - True if the key is pressed; false if released.
     */
    onKeyChange(event, isKeyDown) {
        const key = event.key.toLowerCase();
        switch (key) {
            case "w":
                // Toggle forward movement.
                this.movement.forward = isKeyDown;
                break;
            case "s":
                // Toggle backward movement.
                this.movement.backward = isKeyDown;
                break;
            case "a":
                // Toggle left movement.
                this.movement.left = isKeyDown;
                break;
            case "d":
                // Toggle right movement.
                this.movement.right = isKeyDown;
                break;
            case " ":
                // Toggle upward movement (Y-axis) with Space.
                this.movement.up = isKeyDown;
                break;
            case "shift":
                // Toggle downward movement (Y-axis) with Shift.
                this.movement.down = isKeyDown;
                break;
            case "c":
                // Set the reset flag on pressing "C".
                if (isKeyDown) this.resetVelocity = true;
                break;
        }

        // Emit the updated movement direction.
        this.emitMovementDirection();
    }

    /**
     * Computes a normalized vector based on current movement flags and emits it to observers.
     * Includes a velocity reset flag to enable precise control in the game logic.
     */
    emitMovementDirection() {
        // Initialize vector components.
        let x = 0,
            y = 0,
            z = 0;

        // Determine horizontal movement.
        if (this.movement.right) x += 1;
        if (this.movement.left) x -= 1;

        // Determine forward/backward movement.
        if (this.movement.forward) z += 1;
        if (this.movement.backward) z -= 1;

        // Determine vertical movement.
        if (this.movement.up) y += 1;
        if (this.movement.down) y -= 1;

        // Build a BabylonJS vector from the computed components.
        const direction = new BABYLON.Vector3(x, y, z);

        // Normalize the vector if it has a non-zero length.
        if (typeof direction.length === "function" && direction.length() > 0) {
            direction.normalize();
            window.Logger.log("Normalizing!");
        }

        // Notify subscribed observers with the current movement direction and velocity reset flag.
        this.onMoveObservable.notifyObservers({
            direction,
            resetVelocity: this.resetVelocity
        });

        // Reset the velocity flag after notifying observers.
        this.resetVelocity = false;
    }
}
