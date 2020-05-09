import { Component } from './Component';
import { RenderableGizmo } from '../core/interfaces/RenderableGizmo';
import { Color } from '../core/enums/Color';
import { GameObject } from '../game-objects/GameObject';
import { WeightedGraph } from '../core/interfaces/WeightedGraph';
import { WeightedGraphCell } from '../core/interfaces/WeightedGraphCell';
import { Graph } from '../core/interfaces/Graph';
import { GraphCell } from '../core/interfaces/GraphCell';

export class GraphVisualizer extends Component implements RenderableGizmo {
  private readonly graph: Graph;
  private readonly defaultColor: Color;

  public constructor(gameObject: GameObject, graph: Graph, defaultColor: Color = Color.LightGreen) {
    super(gameObject);

    this.graph = graph;
    this.defaultColor = defaultColor;
  }

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

  protected getColorForCell(cell: GraphCell): Color {
    if (!this.isWeightedGraphCell(cell)) {
      throw new Error('This must only be used with weighted graphs');
    }

    return cell.passable ? this.passableColor : this.unpassableColor;
  }

  private isWeightedGraphCell(cell: GraphCell): cell is WeightedGraphCell {
    return (cell as WeightedGraphCell).passable !== undefined && (cell as WeightedGraphCell).weight !== undefined;
  }
}
