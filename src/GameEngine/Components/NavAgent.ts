import { Component } from './Component';
import { RenderableGizmo } from '../Core/Interfaces/RenderableGizmo';
import { Vector2 } from '../Core/Helpers/Vector2';
import { Color } from '../Core/Enums/Color';
import { NavGrid } from '../Core/Helpers/NavGrid';
import { WeightedGraphCell } from '../Core/Interfaces/WeightedGraphCell';
import { GameEngine } from '../Core/GameEngine';
import { AStarSearch } from '../Core/Helpers/AStarSearch';
import { GameObject } from '../Core/GameObject';

export class NavAgent extends Component implements RenderableGizmo {
    
    public speed: number = 1;
    
    private path: Vector2[] = null;
    private nextPosition: Vector2 = null;
    private pathIndex: number = 0;
    private navGrid: NavGrid<WeightedGraphCell> = null;


    public constructor(gameObject: GameObject) {
        super(gameObject);

        GameEngine.instance.renderingEngine.addRenderableGizmo(this);
    }

    public start(): void {
        if (GameEngine.instance.terrain.navGrid === null) {
            throw new Error('No terrain navigation grid found!');
        }

        this.navGrid = GameEngine.instance.terrain.navGrid;
    }

    public get hasPath(): boolean {
        return this.path !== null;
    }

    public get destination(): Vector2 | null {
        if (!this.hasPath) {
            return null;
        }

        return this.path[this.path.length - 1];
    }

    public update(): void {
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

    public setDestination(destination: Vector2): void {
        this.resetPath();
        
        this.path = AStarSearch.findPath(this.navGrid, this.transform.position, destination);

        if (this.path !== null) {
            this.nextPosition = this.path[0];
            this.pathIndex = 0;
        }
    }

    public resetPath(): void {
        this.path = null;
        this.nextPosition = null;
        this.pathIndex = 0;
    }

    public renderGizmo(context: CanvasRenderingContext2D): void {
        if (this.path === null) {
            return;
        }

        context.beginPath();

        let start = true;
        for (const nodePos of this.path) {
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