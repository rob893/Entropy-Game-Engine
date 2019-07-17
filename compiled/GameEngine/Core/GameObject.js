import { Transform } from "../Components/Transform";
export class GameObject {
    constructor(id, x = 0, y = 0) {
        this.components = [];
        this.componentMap = new Map();
        this.id = id;
        this.transform = new Transform(this, x, y);
    }
    start() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].start();
        }
    }
    update() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update();
        }
    }
    getTransform() {
        return this.transform;
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
        this.components.push(newComponent);
        this.componentMap.set(newComponent.constructor.name, newComponent);
        newComponent.start();
        return newComponent;
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