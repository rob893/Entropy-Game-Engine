import { Key } from "../Enums/Key";

export abstract class Input {

    private static keydownMap: Map<Key, ((event: KeyboardEvent) => void)[]> = new Map<Key, ((event: KeyboardEvent) => void)[]>();
    private static clickMap: Map<number, ((event: MouseEvent) => void)[]> = new Map<number, ((event: MouseEvent) => void)[]>();


    public static init(): void {
        document.addEventListener('keydown', () => this.invokeKeydown(<KeyboardEvent>event));
        document.addEventListener('click', () => this.invokeClick(<MouseEvent>event));
    }

    public static addKeydownListener(keyCode: Key, handler: ((event: KeyboardEvent) => void)): void {
        if (this.keydownMap.has(keyCode)) {
            this.keydownMap.get(keyCode).push(handler);
        }
        else {
            this.keydownMap.set(keyCode, [handler]);
        }
    }

    public static addClickListener(mouseButton: number, handler: ((event: MouseEvent) => void)): void {
        if (this.clickMap.has(mouseButton)) {
            this.clickMap.get(mouseButton).push(handler);
        }
        else {
            this.clickMap.set(mouseButton, [handler]);
        }
    }

    public static clearListeners(): void {
        this.keydownMap.clear();
        this.clickMap.clear();
    }

    private static invokeKeydown(event: KeyboardEvent): void {
        if (this.keydownMap.has(event.keyCode)) {
            this.keydownMap.get(event.keyCode).forEach(handler => handler(event));
        }
    }

    private static invokeClick(event: MouseEvent): void {
        if (this.clickMap.has(event.button)) {
            this.clickMap.get(event.button).forEach(handler => handler(event));
        }
    }
}