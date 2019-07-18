import { Transform } from "../Components/Transform";
export class GameObject {
    constructor(id, x = 0, y = 0) {
        this.components = [];
        this.componentMap = new Map();
        this.isEnabled = false;
        this.id = id;
        this.transform = new Transform(this, x, y);
    }
    start() {
        this.components.forEach(c => c.start());
    }
    update() {
        for (let component of this.components) {
            if (component.enabled) {
                component.update();
            }
        }
    }
    set enabled(enabled) {
        if (enabled === this.isEnabled) {
            return;
        }
        if (enabled) {
            this.components.forEach(c => c.onEnabled());
        }
        else {
            this.components.forEach(c => c.onDisable());
        }
        this.isEnabled = enabled;
    }
    get enabled() {
        return this.isEnabled;
    }
    getTransform() {
        return this.transform;
    }
    hasComponent(component) {
        return this.componentMap.has(component.name);
    }
    getComponent(component) {
        let componentType = component.name;
        if (!this.componentMap.has(componentType)) {
            throw new Error(componentType + " not found on the GameObject with id of " + this.id + "!");
        }
        return this.componentMap.get(componentType);
    }
    addComponent(newComponent) {
        if (this.componentMap.has(newComponent.constructor.name)) {
            throw new Error("There is already a component of type " + newComponent.constructor.name + " on this object!");
        }
        this.componentMap.set(newComponent.constructor.name, newComponent);
        newComponent.enabled = true;
        newComponent.start();
        return newComponent;
    }
    removeComponent(component) {
        if (!this.componentMap.has(component.constructor.name)) {
            throw new Error("This object does not have a " + component.constructor.name + " component!");
        }
        this.components.splice(this.components.indexOf(component), 1);
        this.componentMap.delete(component.constructor.name);
        component.onDestroy();
    }
    setComponents(components) {
        this.components = components;
        for (let component of components) {
            if (this.componentMap.has(component.constructor.name)) {
                throw new Error("There is already a component of type " + component.constructor.name + " on this object!");
            }
            this.componentMap.set(component.constructor.name, component);
        }
    }
}
//# sourceMappingURL=GameObject.js.map