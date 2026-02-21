class RenderController {
    // Frames to render at full speed after any dirty event (90 = 1.5s @ 60fps)
    // Covers: max movement (~19 frames) + explosion VFX (42 frames) + comfort buffer
    static DIRTY_FRAME_BUDGET = 90;
    // Idle keep-alive: render 1 frame per 2 seconds so the scene doesn't look frozen
    static IDLE_RENDER_INTERVAL = 120;
    // UI keep-alive: 1fps when idle (HUD is static between moves)
    static UI_IDLE_RENDER_INTERVAL = 60;

    static _dirtyFrames = 0;
    static _idleCounter = 0;
    static _uiDirty = true;          // start dirty so first frame draws
    static _uiIdleCounter = 0;

    static markDirty(frames) {
        const budget = (frames !== undefined) ? frames : this.DIRTY_FRAME_BUDGET;
        this._dirtyFrames = Math.max(this._dirtyFrames, budget);
        this._uiDirty = true;
    }

    static markUIDirty() {
        this._uiDirty = true;
    }

    static shouldRenderGameScene() {
        if (this._dirtyFrames > 0) {
            this._dirtyFrames--;
            this._idleCounter = 0;
            return true;
        }
        this._idleCounter++;
        if (this._idleCounter >= this.IDLE_RENDER_INTERVAL) {
            this._idleCounter = 0;
            return true;
        }
        return false;
    }

    static shouldRenderUIScene() {
        if (this._uiDirty) {
            this._uiDirty = false;
            this._uiIdleCounter = 0;
            return true;
        }
        this._uiIdleCounter++;
        if (this._uiIdleCounter >= this.UI_IDLE_RENDER_INTERVAL) {
            this._uiIdleCounter = 0;
            return true;
        }
        return false;
    }
}
window.RenderController = RenderController;
