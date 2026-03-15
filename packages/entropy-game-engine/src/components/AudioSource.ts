import { Component } from './Component';
import { GameObject } from '../game-objects/GameObject';
import { AudioClip } from '../core/helpers/AudioClip';
import { SerializedComponent } from '../core';
import { createAudioClipFromSource, getElementSource, readBoolean, readString } from '../core/helpers/Serialization';

export class AudioSource extends Component {
  public static override readonly typeName: string = 'AudioSource';
  private audioElement: HTMLAudioElement;
  private audioClip: AudioClip;

  public constructor(gameObject: GameObject, audioClip: AudioClip) {
    super(gameObject);

    this.audioElement = audioClip.clip;
    this.audioClip = audioClip;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): AudioSource {
    const audioSource = new AudioSource(gameObject, createAudioClipFromSource(readString(data.source)));
    audioSource.deserialize(data);
    return audioSource;
  }

  public get isPlaying(): boolean {
    return !this.audioElement.paused;
  }

  public override serialize(): SerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        loop: this.audioElement.loop,
        playOnStart: this.audioElement.autoplay,
        source: getElementSource(this.audioElement) ?? null,
        isPlaying: this.isPlaying
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const source = readString(data.source);
    if (source !== null) {
      this.setClip(createAudioClipFromSource(source));
    }

    const loop = readBoolean(data.loop);
    if (loop !== null) {
      this.loop = loop;
    }

    const playOnStart = readBoolean(data.playOnStart);
    if (playOnStart !== null) {
      this.playOnStart = playOnStart;
    }
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
