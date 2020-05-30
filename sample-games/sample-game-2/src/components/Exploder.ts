import { Component, AudioSource, Rigidbody, GameObject, Vector2 } from '@entropy-engine/entropy-game-engine';

export class Exploder extends Component {
  private readonly audioSource: AudioSource;

  public constructor(gameObject: GameObject, audioSource: AudioSource) {
    super(gameObject);

    this.audioSource = audioSource;
  }

  public start(): void {
    this.destroy(this.gameObject, 5);
    this.audioSource.play();
  }
}
