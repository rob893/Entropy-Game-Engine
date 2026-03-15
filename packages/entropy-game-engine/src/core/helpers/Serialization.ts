import { Animation } from './Animation';
import type { AudioClip } from './AudioClip';
import type { ISerializedVector2Value, ISerializedBoundsValue } from './types';

// Re-export for convenience
export type { ISerializedVector2Value, ISerializedBoundsValue };

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function readString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export function readBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

export function readVector2(value: unknown): ISerializedVector2Value | null {
  if (!isRecord(value)) {
    return null;
  }

  const x = readNumber(value.x);
  const y = readNumber(value.y);

  if (x === null || y === null) {
    return null;
  }

  return { x, y };
}

export function readBounds(value: unknown): ISerializedBoundsValue | null {
  if (!isRecord(value)) {
    return null;
  }

  const min = readVector2(value.min);
  const max = readVector2(value.max);

  if (min === null || max === null) {
    return null;
  }

  return { min, max };
}

export function getElementSource(element: { currentSrc?: string; src?: string }): string | undefined {
  if (typeof element.currentSrc === 'string' && element.currentSrc.length > 0) {
    return element.currentSrc;
  }

  if (typeof element.src === 'string' && element.src.length > 0) {
    return element.src;
  }

  return undefined;
}

export function createImageFromSource(source?: string | null): HTMLImageElement {
  const image = document.createElement('img');

  if (typeof source === 'string' && source.length > 0) {
    image.src = source;
  }

  return image;
}

export function createAudioClipFromSource(source?: string | null): AudioClip {
  const audioElement = document.createElement('audio');

  if (typeof source === 'string' && source.length > 0) {
    audioElement.src = source;
  }

  return {
    get clip(): HTMLAudioElement {
      return audioElement;
    }
  } as AudioClip;
}

export function createAnimationFromSource(source?: string | null): Animation {
  return new Animation([createImageFromSource(source)]);
}
