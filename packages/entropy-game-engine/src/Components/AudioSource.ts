import { Component } from './Component';
import { GameObject } from '../game-objects/GameObject';
import { AudioClip } from '../core/helpers/AudioClip';

export class AudioSource extends Component {
  private audioElement: HTMLAudioElement;
  private audioClip: AudioClip;

  public constructor(gameObject: GameObject, audioClip: AudioClip) {
    super(gameObject);

    this.audioElement = audioClip.clip;
    this.audioClip = audioClip;
  }

  public get isPlaying(): boolean {
    return !this.audioElement.paused;
  }

  public set loop(loop: boolean) {
    this.audioElement.loop = loop;
  }

  public set playOnStart(playOnStart: boolean) {
    this.audioElement.autoplay = playOnStart;
  }

  public setClip(audioClip: AudioClip): void {
    this.audioElement = audioClip.clip;
    this.audioClip = audioClip;
  }

  public play(): void {
    this.audioElement.play();
  }

  public playOneShot(): void {
    this.audioClip.clip.play();
  }

  public pause(): void {
    this.audioElement.pause();
  }
}
