/**
 * MovementTracker
 * 
 * Tracks all player movements during gameplay for replay purposes.
 * Records direction, destination, and timing information for each move.
 */
class MovementTracker {
    constructor() {
        this.movements = []; // Array of recorded movements
        this.isTracking = false;
        this.pickupPositions = []; // Track positions where pickups occurred
        this.damagePositions = []; // Track positions where damage occurred
    }

    /**
     * Starts tracking movements
     */
    startTracking() {
        this.movements = [];
        this.pickupPositions = [];
        this.damagePositions = [];
        this.isTracking = true;
        //console.log("[MOVEMENT TRACKER] Started tracking movements");
    }

    /**
     * Stops tracking movements
     */
    stopTracking() {
        this.isTracking = false;
        //  console.log(`[MOVEMENT TRACKER] Stopped tracking. Recorded ${this.movements.length} movements`);
    }

    /**
     * Records a movement
     * @param {string} direction - The direction of movement (e.g., "up", "down", "left", "right")
     * @param {BABYLON.Vector3} startPosition - The starting position
     * @param {BABYLON.Vector3} destinationPosition - The destination position
     */
    recordMovement(direction, startPosition, destinationPosition) {
        if (!this.isTracking) return;

        const movement = {
            direction: direction,
            startPosition: startPosition.clone(),
            destinationPosition: destinationPosition.clone(),
            timestamp: Date.now()
        };

        this.movements.push(movement);
        //   console.log(`[MOVEMENT TRACKER] Recorded movement: ${direction} from (${startPosition.x}, ${startPosition.z}) to (${destinationPosition.x}, ${destinationPosition.z})`);
    }

    /**
     * Records a pickup position
     * @param {BABYLON.Vector3} position - The position where a pickup occurred
     */
    recordPickupPosition(position) {
        if (!this.isTracking) return;

        this.pickupPositions.push({
            position: position.clone(),
            timestamp: Date.now()
        });
    }

    /**
     * Records a damage position
     * @param {BABYLON.Vector3} position - The position where damage occurred
     */
    recordDamagePosition(position) {
        if (!this.isTracking) return;

        this.damagePositions.push({
            position: position.clone(),
            timestamp: Date.now()
        });
    }

    /**
     * Gets all recorded movements
     * @returns {Array} Array of movement records
     */
    getMovements() {
        return this.movements;
    }

    /**
     * Gets all recorded pickup positions
     * @returns {Array} Array of pickup position records
     */
    getPickupPositions() {
        return this.pickupPositions;
    }

    /**
     * Gets all recorded damage positions
     * @returns {Array} Array of damage position records
     */
    getDamagePositions() {
        return this.damagePositions;
    }

    /**
     * Clears all recorded movements
     */
    clear() {
        this.movements = [];
        this.pickupPositions = [];
        this.damagePositions = [];
    }
}

