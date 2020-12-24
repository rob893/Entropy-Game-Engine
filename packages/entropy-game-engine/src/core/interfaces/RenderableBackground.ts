import { Camera } from '../../components/Camera';

export interface RenderableBackground {
  renderBackground(context: CanvasRenderingContext2D, camera?: Camera): void;
}
