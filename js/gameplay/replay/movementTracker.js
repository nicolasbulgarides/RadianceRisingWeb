/**
 * MovementTracker
 *
 * Tracks all player interactions during gameplay for replay purposes.
 * Uses a unified event log keyed by step number. Subscribes to GameEventBus
 * so any subsystem can record interactions without coupling to this class.
 */

// Global debug flag for MovementTracker
const MOVEMENT_TRACKER_DEBUG = false;

class MovementTracker {
    constructor() {
        this.eventLog = [];
        this.realMoveCount = 0;
        this.isTracking = false;

        this._boundHandler = (data) => this.handleInteractionEvent(data);
        GameEventBus.on("gameInteraction", this._boundHandler);
    }

    /**
     * Debug logging method for MovementTracker operations
     */
    movementTrackerDebugLog(...args) {
        if (MOVEMENT_TRACKER_DEBUG) {
            console.log("[MOVEMENT TRACKER]", ...args);
        }
    }

    /**
     * Handles a game interaction event emitted via GameEventBus.
     * @param {Object} data - Event data with at minimum a `type` field.
     */
    handleInteractionEvent(data) {
        if (!this.isTracking) return;

        const { type } = data;

        if (type === 'move') {
            this.eventLog.push({
                type: 'move',
                step: this.realMoveCount,
                direction: data.direction,
                startPosition: data.startPosition.clone(),
                destinationPosition: data.destinationPosition.clone()
            });
            this.realMoveCount++;
        } else if (type === 'lock') {
            this.eventLog.push({
                type: 'lock',
                step: Math.max(0, this.realMoveCount - 1),
                position: data.position.clone()
            });
        } else if (type === 'pickup') {
            this.eventLog.push({
                type: 'pickup',
                step: Math.max(0, this.realMoveCount - 1),
                position: data.position.clone()
            });
        } else if (type === 'damage') {
            this.eventLog.push({
                type: 'damage',
                step: Math.max(0, this.realMoveCount - 1),
                position: data.position.clone()
            });
        } else if (type === 'key_usage') {
            this.eventLog.push({
                type: 'key_usage',
                step: this.realMoveCount,
                position: data.position.clone()
            });
        }

        this.movementTrackerDebugLog(`Recorded '${type}' event. Total log entries: ${this.eventLog.length}`);
    }

    /**
     * Starts tracking interactions
     */
    startTracking() {
        this.eventLog = [];
        this.realMoveCount = 0;
        this.isTracking = true;
    }

    /**
     * Stops tracking interactions
     */
    stopTracking() {
        this.isTracking = false;
    }

    /**
     * Clears all recorded events
     */
    clear() {
        this.eventLog = [];
        this.realMoveCount = 0;
    }

    /**
     * Returns the unified event log
     * @returns {Array}
     */
    getEventLog() {
        return this.eventLog;
    }
}
