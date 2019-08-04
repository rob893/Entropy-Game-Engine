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
        if (!this.gameObject.enabled) {
            return false;
        }
        return this.isEnabled;
    }
    get transform() {
        return this.gameObject.transform;
    }
    onEnabled() { }
    start() { }
    update() {
        this.gameObject.removeComponentFromUpdate(this);
    }
    onDisable() { }
    onDestroy() { }
}
//# sourceMappingURL=Component.js.map