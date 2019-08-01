export class Input {
    static init() {
        document.addEventListener('keydown', () => this.invokeKeydown(event));
        document.addEventListener('click', () => this.invokeClick(event));
    }
    static addKeydownListener(keyCode, handler) {
        if (this.keydownMap.has(keyCode)) {
            this.keydownMap.get(keyCode).push(handler);
        }
        else {
            this.keydownMap.set(keyCode, [handler]);
        }
    }
    static addClickListener(mouseButton, handler) {
        if (this.clickMap.has(mouseButton)) {
            this.clickMap.get(mouseButton).push(handler);
        }
        else {
            this.clickMap.set(mouseButton, [handler]);
        }
    }
    static clearListeners() {
        this.keydownMap.clear();
        this.clickMap.clear();
    }
    static invokeKeydown(event) {
        if (this.keydownMap.has(event.keyCode)) {
            this.keydownMap.get(event.keyCode).forEach(handler => handler(event));
        }
    }
    static invokeClick(event) {
        if (this.clickMap.has(event.button)) {
            this.clickMap.get(event.button).forEach(handler => handler(event));
        }
    }
}
Input.keydownMap = new Map();
Input.clickMap = new Map();
//# sourceMappingURL=Input.js.map