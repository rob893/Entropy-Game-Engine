import { GameEngine, Color } from '@entropy-engine/entropy-game-engine';
import { scene1, scene3 } from './Scenes';
import backgroundImage from './Assets/Images/background.jpg';

function setBodyStyles({ style }: HTMLBodyElement): void {
  style.backgroundColor = Color.BlueGrey;
  style.backgroundImage = `url('${backgroundImage}')`;
}

function setCanvasStyles({ style }: HTMLCanvasElement): void {
  style.padding = '0';
  style.margin = 'auto';
  style.display = 'block';
  style.position = 'absolute';
  style.top = '0';
  style.bottom = '0';
  style.left = '0';
  style.right = '0';
  style.border = `2px solid ${Color.RedGrey}`;
}

async function main(): Promise<void> {
  const bodyElement = document.getElementById('body') as HTMLBodyElement;
  const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;

  setBodyStyles(bodyElement);
  setCanvasStyles(gameCanvas);

  const gameEngine = new GameEngine(gameCanvas);

  gameEngine.developmentMode = true;

  gameEngine.setScenes([scene1, scene3]);

  await gameEngine.loadScene(1);
}

window.onload = async () => {
  await main();
};
