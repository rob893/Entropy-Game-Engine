import { Component } from './Component';
import { RenderableGizmo } from '../core/interfaces/RenderableGizmo';
import { Vector2 } from '../core/helpers/Vector2';
import { Color } from '../core/enums/Color';
import { NavGrid } from '../core/helpers/NavGrid';
import { AStarSearch } from '../core/helpers/AStarSearch';
import { GameObject } from '../game-objects/GameObject';
import { Topic } from '../core/helpers/Topic';

export class NavAgent extends Component implements RenderableGizmo {
  public speed: number = 1;
  public readonly onDirectionChanged = new Topic<Vector2>();
  public readonly onPathCompleted = new Topic<void>();

  private path: Vector2[] | null = null;
  private nextPosition: Vector2 | null = null;
  private pathIndex: number = 0;
  private readonly navGrid: NavGrid;

  public constructor(gameObject: GameObject, navGrid: NavGrid) {
    super(gameObject);

    this.navGrid = navGrid;
  }

  public get heading(): Vector2 | null {
    if (this.nextPosition === null) {
      return null;
    }

    return Vector2.direction(this.transform.position, this.nextPosition);
  }

  public get hasPath(): boolean {
    return this.path !== null;
  }

  public get destination(): Vector2 | null {
    if (this.path === null) {
      return null;
    }

    return this.path[this.path.length - 1];
  }

  public override update(): void {
    if (this.nextPosition === null || this.path === null) {
      return;
    }

    if (this.transform.position.isCloseTo(this.nextPosition)) {
      this.pathIndex++;

      if (this.pathIndex >= this.path.length) {
        this.resetPath();
        this.onPathCompleted.publish();
        return;
      }

      this.nextPosition = this.path[this.pathIndex];

      if (this.heading !== null) {
        this.onDirectionChanged.publish(this.heading);
      }
    }

    this.transform.translate(Vector2.direction(this.transform.position, this.nextPosition).multiplyScalar(this.speed));
  }

  public setDestination(destination: Vector2): void {
    this.resetPath();

    this.path = AStarSearch.findPath(this.navGrid, this.transform.position, destination);

    if (this.path !== null) {
      [this.nextPosition] = this.path;
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
