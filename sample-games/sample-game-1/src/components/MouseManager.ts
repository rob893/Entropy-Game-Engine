import { Component, Cursor, EventType, GameObject, Layer, Camera } from '@entropy-engine/entropy-game-engine';
import defaultMouseCursor from '../assets/images/cursors/cursor_final.png';
import redMouseCursor from '../assets/images/cursors/cursor_outline_red.png';

export class MouseManager extends Component {
  private currentCursor?: string;
  private camera: Camera = null!;

  public constructor(gameObject: GameObject) {
    super(gameObject);
    this.changeCursor(defaultMouseCursor);

    this.input.addMouseListener(EventType.MouseDown, 0, () => {
      console.log(this.input.canvasMousePosition);
      const thing = this.gameCanvas.getContext('2d')?.getTransform();
      console.log(thing);
    });
  }

  public start(): void {
    const cameraGameObject = this.findGameObjectWithTag('mainCamera');

    if (!cameraGameObject) {
      throw new Error('No camera in scene');
    }

    const cameraComponent = cameraGameObject.getComponent(Camera);

    if (!cameraComponent) {
      throw new Error('No camera in scene');
    }

    this.camera = cameraComponent;

    document.addEventListener('wheel', (event: WheelEvent) => {
      this.camera.zoom += event.deltaY * -0.001;
    });

    const player = this.findGameObjectWithTag('player');

    if (!player) {
      throw new Error('No player found');
    }

    this.camera.followTarget(player);
  }

  public override update(): void {
    const hit = this.physics.pointRaycastToScreen(this.camera.screenPointToGameWorld(this.input.canvasMousePosition));

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
