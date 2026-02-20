class GameEventBus {
    static on(type, handler) {
        if (!GameEventBus._handlers[type]) GameEventBus._handlers[type] = [];
        GameEventBus._handlers[type].push(handler);
    }

    static emit(type, data) {
        (GameEventBus._handlers[type] || []).forEach(function(h) { h(data); });
    }

    static off(type, handler) {
        if (!GameEventBus._handlers[type]) return;
        GameEventBus._handlers[type] = GameEventBus._handlers[type].filter(function(h) { return h !== handler; });
    }
}
// Initialize outside the class body for maximum browser compatibility
// (avoids Safari 14.0 static class field bug)
GameEventBus._handlers = {};
