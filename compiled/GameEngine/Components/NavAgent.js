import { Component } from "./Component";
import { Vector2 } from "../Core/Helpers/Vector2";
import { Color } from "../Core/Enums/Color";
import { GameEngine } from "../Core/GameEngine";
import { AStarSearch } from "../Core/Helpers/AStarSearch";
export class NavAgent extends Component {
    constructor(gameObject) {
        super(gameObject);
        this.speed = 1;
        this.path = null;
        this.nextPosition = null;
        this.pathIndex = 0;
        this.navGrid = null;
        GameEngine.instance.renderingEngine.addRenderableGizmo(this);
    }
    start() {
        if (GameEngine.instance.terrain.navGrid === null) {
            throw new Error('No terrain navigation grid found!');
        }
        this.navGrid = GameEngine.instance.terrain.navGrid;
    }
    get hasPath() {
        return this.path !== null;
    }
    get destination() {
        if (!this.hasPath) {
            return null;
        }
        return this.path[this.path.length - 1];
    }
    update() {
        if (this.nextPosition === null) {
            return;
        }
        if (this.transform.position.isCloseTo(this.nextPosition)) {
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                this.resetPath();
                return;
            }
            this.nextPosition = this.path[this.pathIndex];
        }
        this.transform.translate(Vector2.direction(this.transform.position, this.nextPosition).multiplyScalar(this.speed));
    }
    setDestination(destination) {
        this.resetPath();
        this.path = AStarSearch.findPath(this.navGrid, this.transform.position, destination);
        if (this.path !== null) {
            this.nextPosition = this.path[0];
            this.pathIndex = 0;
        }
    }
    resetPath() {
        this.path = null;
        this.nextPosition = null;
        this.pathIndex = 0;
    }
    renderGizmo(context) {
        if (this.path === null) {
            return;
        }
        context.beginPath();
        let start = true;
        for (let nodePos of this.path) {
            if (start) {
                start = false;
                context.moveTo(nodePos.x, nodePos.y);
                continue;
            }
            context.lineTo(nodePos.x, nodePos.y);
        }
        context.strokeStyle = Color.Orange;
        context.stroke();
    }
}
//# sourceMappingURL=NavAgent.js.map