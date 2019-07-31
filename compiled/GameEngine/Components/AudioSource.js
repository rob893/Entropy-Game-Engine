var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component } from "./Component";
export class AudioSource extends Component {
    constructor(gameObject, audioURL) {
        super(gameObject);
        this.ready = false;
        let audioClip = new Audio(audioURL);
        audioClip.onloadeddata = () => {
            this.audioClip = audioClip;
            this.ready = true;
        };
    }
    get isPlaying() {
        if (!this.ready) {
            return false;
        }
        return !(this.audioClip.paused);
    }
    set loop(loop) {
        if (!this.ready) {
            setTimeout(() => this.loop = loop, 250);
            return;
        }
        this.audioClip.loop = loop;
    }
    set playOnStart(playOnStart) {
        if (!this.ready) {
            setTimeout(() => this.playOnStart = playOnStart, 250);
            return;
        }
        this.audioClip.autoplay = playOnStart;
    }
    setClip(audioURL) {
        this.ready = false;
        let newClip = new Audio(audioURL);
        newClip.onloadeddata = () => {
            this.audioClip = newClip;
            this.ready = true;
        };
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready) {
                setTimeout(() => this.play(), 250);
                return;
            }
            yield this.audioClip.play();
        });
    }
    pause() {
        if (!this.ready) {
            setTimeout(() => this.pause(), 250);
            return;
        }
        this.audioClip.pause();
    }
}
//# sourceMappingURL=AudioSource.js.map