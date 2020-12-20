import { Component, Cursor, EventType, GameObject, Layer } from '@entropy-engine/entropy-game-engine';
import defaultMouseCursor from '../assets/images/cursors/cursor_final.png';
import redMouseCursor from '../assets/images/cursors/cursor_outline_red.png';

export class MouseManager extends Component {
  private currentCursor?: string;

  public constructor(gameObject: GameObject) {
    super(gameObject);
    this.changeCursor(defaultMouseCursor);
    this.input.addMouseListener(EventType.MouseDown, 0, () => {
      console.log(this.input.canvasMousePosition);
      const thing = this.gameCanvas.getContext('2d')?.getTransform();
      console.log(thing);
    });
  }

  public update(): void {
    const hit = this.physics.pointRaycastToScreen(this.input.canvasMousePosition);

    if (hit && (hit.gameObject.layer === Layer.Hostile || hit.gameObject.tag === 'player')) {
      this.changeCursor(redMouseCursor);
    } else {
      this.changeCursor(defaultMouseCursor);
    }
  }

  private changeCursor(cursorUrl: string): void {
    if (this.currentCursor === cursorUrl) {
      return;
    }

    this.currentCursor = cursorUrl;
    Cursor.setCursor(cursorUrl);
  }
}
