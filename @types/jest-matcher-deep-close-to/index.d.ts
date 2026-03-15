import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeDeepCloseTo: (expected: number | number[] | object, decimals?: number) => void;
    toMatchCloseTo: (expected: number | number[] | object, decimals?: number) => void;
  }
}

declare module 'jest-matcher-deep-close-to' {
  export function toBeDeepCloseTo(
    received: number | number[] | object,
    expected: number | number[] | object,
    decimals?: number
  ): {
    pass: boolean;
    message(): string;
  };

  export function toMatchCloseTo(
    received: number | number[] | object,
    expected: number | number[] | object,
    decimals?: number
  ): {
    pass: boolean;
    message(): string;
  };
}
