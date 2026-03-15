import { Component } from './Component';
import type { IRenderableGizmo } from '../core/types';
import { Color } from '../core/enums/Color';
import type { GameObject } from '../game-objects/GameObject';
import type { IWeightedGraph } from '../core/types';
import type { IWeightedGraphCell } from '../core/types';
import type { IGraph } from '../core/types';
import type { IGraphCell } from '../core/types';
import type { ISerializedComponent } from '../core';
import { readString } from '../core/helpers/Serialization';

export class GraphVisualizer extends Component implements IRenderableGizmo {
  public static override readonly typeName: string = 'GraphVisualizer';
  private readonly graph: IGraph;
  private readonly defaultColor: Color;

  public constructor(gameObject: GameObject, graph: IGraph, defaultColor: Color = Color.LightGreen) {
    super(gameObject);

    this.graph = graph;
    this.defaultColor = defaultColor;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): GraphVisualizer {
    return new GraphVisualizer(
      gameObject,
      gameObject.terrain.navGrid,
      (readString(data.defaultColor) ?? Color.LightGreen) as Color
    );
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        defaultColor: this.defaultColor
      }
    };
  }

  public override deserialize(): void {}

  public renderGizmo(context: CanvasRenderingContext2D): void {
    for (const cell of this.graph.graphCells) {
      context.beginPath();
      context.moveTo(cell.position.x, cell.position.y);
      context.lineTo(cell.position.x, cell.position.y + this.graph.cellSize);
      context.lineTo(cell.position.x + this.graph.cellSize, cell.position.y + this.graph.cellSize);
      context.lineTo(cell.position.x + this.graph.cellSize, cell.position.y);
      context.lineTo(cell.position.x, cell.position.y);
      context.strokeStyle = this.getColorForCell(cell);
      context.stroke();
    }
  }

  protected getColorForCell(cell: IGraphCell): Color {
    if (cell.position === undefined) {
      throw new Error('Graph cells must define a position.');
    }

    return this.defaultColor;
  }
}

export class WeightedGraphVisualizer extends GraphVisualizer {
  public static override readonly typeName: string = 'WeightedGraphVisualizer';
  private readonly passableColor: Color;
  private readonly unpassableColor: Color;

  public constructor(
    gameObject: GameObject,
    weightedGraph: IWeightedGraph,
    passableColor: Color = Color.Blue,
    unpassableColor: Color = Color.Red
  ) {
    super(gameObject, weightedGraph);

    this.passableColor = passableColor;
    this.unpassableColor = unpassableColor;
  }

  public static override createFromSerialized(
    gameObject: GameObject,
    data: Record<string, unknown>
  ): WeightedGraphVisualizer {
    return new WeightedGraphVisualizer(
      gameObject,
      gameObject.terrain.navGrid,
      (readString(data.passableColor) ?? Color.Blue) as Color,
      (readString(data.unpassableColor) ?? Color.Red) as Color
    );
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        passableColor: this.passableColor,
        unpassableColor: this.unpassableColor
      }
    };
  }

  public override deserialize(): void {}

  protected override getColorForCell(cell: IGraphCell): Color {
    if (!this.isWeightedGraphCell(cell)) {
      throw new Error('This must only be used with weighted graphs');
    }

    return cell.passable ? this.passableColor : this.unpassableColor;
  }

  private isWeightedGraphCell(cell: IGraphCell): cell is IWeightedGraphCell {
    return (cell as IWeightedGraphCell).passable !== undefined && (cell as IWeightedGraphCell).weight !== undefined;
  }
}
