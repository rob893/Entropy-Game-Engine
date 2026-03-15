import { Component } from './Component';
import { RenderableGizmo } from '../core/interfaces/RenderableGizmo';
import { Color } from '../core/enums/Color';
import { GameObject } from '../game-objects/GameObject';
import { WeightedGraph } from '../core/interfaces/WeightedGraph';
import { WeightedGraphCell } from '../core/interfaces/WeightedGraphCell';
import { Graph } from '../core/interfaces/Graph';
import { GraphCell } from '../core/interfaces/GraphCell';
import { SerializedComponent } from '../core';
import { readString } from '../core/helpers/Serialization';

export class GraphVisualizer extends Component implements RenderableGizmo {
  public static override readonly typeName: string = 'GraphVisualizer';
  private readonly graph: Graph;
  private readonly defaultColor: Color;

  public constructor(gameObject: GameObject, graph: Graph, defaultColor: Color = Color.LightGreen) {
    super(gameObject);

    this.graph = graph;
    this.defaultColor = defaultColor;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): GraphVisualizer {
    return new GraphVisualizer(gameObject, gameObject.terrain.navGrid, (readString(data.defaultColor) ?? Color.LightGreen) as Color);
  }

  public override serialize(): SerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        defaultColor: this.defaultColor
      }
    };
  }

  public override deserialize(_data: Record<string, unknown>): void {}

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

  protected getColorForCell(cell: GraphCell): Color {
    return this.defaultColor;
  }
}

export class WeightedGraphVisualizer extends GraphVisualizer {
  public static override readonly typeName: string = 'WeightedGraphVisualizer';
  private readonly passableColor: Color;
  private readonly unpassableColor: Color;

  public constructor(
    gameObject: GameObject,
    weightedGraph: WeightedGraph,
    passableColor: Color = Color.Blue,
    unpassableColor: Color = Color.Red
  ) {
    super(gameObject, weightedGraph);

    this.passableColor = passableColor;
    this.unpassableColor = unpassableColor;
  }

  public static override createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): WeightedGraphVisualizer {
    return new WeightedGraphVisualizer(
      gameObject,
      gameObject.terrain.navGrid,
      (readString(data.passableColor) ?? Color.Blue) as Color,
      (readString(data.unpassableColor) ?? Color.Red) as Color
    );
  }

  public override serialize(): SerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        passableColor: this.passableColor,
        unpassableColor: this.unpassableColor
      }
    };
  }

  public override deserialize(_data: Record<string, unknown>): void {}

  protected override getColorForCell(cell: GraphCell): Color {
    if (!this.isWeightedGraphCell(cell)) {
      throw new Error('This must only be used with weighted graphs');
    }

    return cell.passable ? this.passableColor : this.unpassableColor;
  }

  private isWeightedGraphCell(cell: GraphCell): cell is WeightedGraphCell {
    return (cell as WeightedGraphCell).passable !== undefined && (cell as WeightedGraphCell).weight !== undefined;
  }
}
