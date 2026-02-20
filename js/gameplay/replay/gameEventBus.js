class GameEventBus {
    static _handlers = {};

    static on(type, handler) {
        if (!this._handlers[type]) this._handlers[type] = [];
        this._handlers[type].push(handler);
    }

    static emit(type, data) {
        (this._handlers[type] || []).forEach(h => h(data));
    }

    static off(type, handler) {
        if (!this._handlers[type]) return;
        this._handlers[type] = this._handlers[type].filter(h => h !== handler);
    }
}
