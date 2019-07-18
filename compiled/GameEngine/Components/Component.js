export class Component {
    constructor(gameObject, enabled = true) {
        this.gameObject = gameObject;
        this.enabled = enabled;
    }
    set enabled(enabled) {
        if (enabled === this.isEnabled) {
            return;
        }
        this.isEnabled = enabled;
        if (enabled) {
            this.onEnabled();
        }
        else {
            this.onDisable();
        }
    }
    get enabled() {
        return this.isEnabled;
    }
    onEnabled() { }
    start() { }
    update() { }
    onDisable() { }
    onDestroy() { }
}
//# sourceMappingURL=Component.js.map