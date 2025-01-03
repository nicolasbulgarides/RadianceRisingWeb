class VelocityManager {
    constructor(onMoveObservable, model, { maxSpeed = 0.2, accelerationRate = 0.05, friction = 0.04 } = {}) {
        this.model = model;
        this.maxSpeed = maxSpeed;
        this.accelerationRate = accelerationRate;
        this.friction = friction;
        this.velocity = new BABYLON.Vector3(0, 0, 0);

        if (model == null) {
            window.Logger.log("Velocity manager model null!");
        } else {
            window.Logger.log("Velocity manager currently active with model!");
        }

        // Subscribe to the onMoveObservable to receive direction updates
        onMoveObservable.add((direction) => {
            this.applyAcceleration(direction);
        });
    }

    // Apply acceleration in the received direction vector, including Y-axis
    applyAcceleration(direction) {
        if (direction.length() > 0) {
            const acceleration = direction.scale(this.accelerationRate);
            this.velocity.addInPlace(acceleration);
            this.clampVelocity();
        } else {
            this.applyFriction();
        }
    }

    // Clamp velocity to max speed for all axes, including Y
    clampVelocity() {
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity = this.velocity.normalize().scale(this.maxSpeed);
        }
    }

    // Apply friction to gradually reduce speed when no input is active
    applyFriction() {
        this.velocity = this.velocity.scale(1 - this.friction);
        if (this.velocity.length() < 0.001) {
            this.velocity.set(0, 0, 0);
        }
    }
    // Method to clear velocity
    clearVelocity() {
        this.velocity.set(0, 0, 0);
        window.Logger.log("VelocityManager: Velocity cleared.");
    }
    // Update model position based on velocity, including Y-axis movement
    updatePosition() {
        if (this.model && this.model.position instanceof BABYLON.Vector3) {
            // Update each component of the position directly, including Y-axis
            this.model.position.x += this.velocity.x;
            this.model.position.y += this.velocity.y;
            this.model.position.z += this.velocity.z;

            // Optional logging for debugging
            //window.Logger.log(`Position updated to: x=${this.model.position.x}, y=${this.model.position.y}, z=${this.model.position.z}`);
        } else if (this.model && !this.model.position) {
            window.Logger.log("model found to update position but no position. Model type:", typeof this.model);
            window.Logger.log("Model constructor name:", this.model.constructor.name);
        } else {
            window.Logger.log("model not found");
        }
    }
}
