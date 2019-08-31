import { Component } from './Component';
import { GameObject } from '../Core/GameObject';
import { AudioClip } from '../Core/Helpers/AudioClip';

export class AudioSource extends Component {

    private audioClip: HTMLAudioElement;


    public constructor(gameObject: GameObject, audioClip: AudioClip) {
        super(gameObject);

        this.audioClip = audioClip.clip;
    }

    public get isPlaying(): boolean {
        return !(this.audioClip.paused);
    }

    public set loop(loop: boolean) {
        this.audioClip.loop = loop;
    }

    public set playOnStart(playOnStart: boolean) {
        this.audioClip.autoplay = playOnStart;
    }


    public setClip(audioClip: AudioClip): void {
        this.audioClip = audioClip.clip;
    }

    public async play(): Promise<void> {
        await this.audioClip.play();
    }

    public pause(): void {
        this.audioClip.pause();
    }
}