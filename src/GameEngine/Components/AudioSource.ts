import { Component } from "./Component";
import { GameObject } from "../Core/GameObject";

export class AudioSource extends Component {

    private audioClip: HTMLAudioElement;
    private ready: boolean = false;


    public constructor(gameObject: GameObject, audioURL?: string) {
        super(gameObject);

        let audioClip = new Audio(audioURL);
        audioClip.onloadeddata = () => {
            this.audioClip = audioClip;
            this.ready = true;
        }
    }

    public get isPlaying(): boolean {
        if (!this.ready) {
            return false;
        }

        return !(this.audioClip.paused);
    }

    public set loop(loop: boolean) {
        if (!this.ready) {
            setTimeout(() => this.loop = loop, 250);
            return;
        }

        this.audioClip.loop = loop;
    }

    public set playOnStart(playOnStart: boolean) {
        if (!this.ready) {
            setTimeout(() => this.playOnStart = playOnStart, 250);
            return;
        }
        
        this.audioClip.autoplay = playOnStart;
    }


    public setClip(audioURL: string): void {
        this.ready = false;
        let newClip = new Audio(audioURL);
        newClip.onloadeddata = () => {
            this.audioClip = newClip;
            this.ready = true;
        }
    }

    public play(): void {
        if (!this.ready) {
            setTimeout(() => this.play(), 250);
            return;
        }

        this.audioClip.play();
    }

    public pause(): void {
        if (!this.ready) {
            setTimeout(() => this.pause(), 250);
            return;
        }

        this.audioClip.pause();
    }
}