import { Transform } from '../Components/Transform';
export class GameObject {
    constructor(id, x = 0, y = 0, tag = '') {
        this.components = [];
        this.componentMap = new Map();
        this.id = id;
        this._transform = new Transform(this, x, y);
        this.isEnabled = true;
        this.tag = tag;
    }
    start() {
        this.components.forEach(c => c.start());
    }
    update() {
        for (const component of this.components) {
            if (component.enabled) {
                component.update();
            }
        }
    }
    set enabled(enabled) {
        if (enabled === this.isEnabled) {
            return;
        }
        this.isEnabled = enabled;
        for (const component of this.components) {
            if (component.enabled) {
                enabled ? component.onEnabled() : component.onDisable();
            }
        }
    }
    get enabled() {
        return this.isEnabled;
    }
    get transform() {
        return this._transform;
    }
    hasComponent(component) {
        return this.componentMap.has(component.name);
    }
    getComponent(component) {
        const componentType = component.name;
        if (!this.componentMap.has(componentType)) {
            throw new Error(componentType + ' not found on the GameObject with id of ' + this.id + '!');
        }
        return this.componentMap.get(componentType)[0];
    }
    getComponents(component) {
        const componentType = component.name;
        if (!this.componentMap.has(componentType)) {
            throw new Error(componentType + ' not found on the GameObject with id of ' + this.id + '!');
        }
        return this.componentMap.get(componentType);
    }
    addComponent(newComponent) {
        if (this.componentMap.has(newComponent.constructor.name)) {
            this.componentMap.get(newComponent.constructor.name).push(newComponent);
        }
        else {
            this.componentMap.set(newComponent.constructor.name, [newComponent]);
        }
        newComponent.enabled = true;
        newComponent.start();
        return newComponent;
    }
    removeComponent(component) {
        if (!this.componentMap.has(component.constructor.name)) {
            throw new Error('This object does not have a ' + component.constructor.name + ' component!');
        }
        this.components.splice(this.components.indexOf(component), 1);
        this.componentMap.delete(component.constructor.name);
        component.onDestroy();
    }
    setComponents(components) {
        for (const component of components) {
            this.components.push(component);
            if (this.componentMap.has(component.constructor.name)) {
                this.componentMap.get(component.constructor.name).push(component);
            }
            else {
                this.componentMap.set(component.constructor.name, [component]);
            }
        }
    }
}
//# sourceMappingURL=GameObject.js.map