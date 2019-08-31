export class AudioClip {

    private readonly audioElements: HTMLAudioElement[] = [];
    private index: number = 0;

    
    private constructor() {}

    public static async buildAudioClipAsync(audioURL: string, numberOfClones: number = 1): Promise<AudioClip> {
        const audioClip = new AudioClip();

        await audioClip.initializeAudioClip(audioURL, numberOfClones);

        return audioClip;
    }

    public get clip(): HTMLAudioElement {
        this.index = (this.index + 1) % this.audioElements.length;

        return this.audioElements[this.index];
    }

    private async initializeAudioClip(audioURL: string, numberOfClones: number): Promise<void> {
        return new Promise(resolve => {
            for (let i = 0; i < numberOfClones; i++) {
                const audioClip = new Audio(audioURL);
                audioClip.onloadeddata = () => {
                    this.audioElements.push(audioClip);

                    if (i === numberOfClones - 1) {
                        resolve();
                    }
                };
            }
        });
    }
}