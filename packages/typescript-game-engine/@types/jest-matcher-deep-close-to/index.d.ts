declare module 'jest-matcher-deep-close-to' {
    global {
        namespace jest {
            interface Matchers<R> {
                toBeDeepCloseTo: (expected: number | number[] | object, decimals?: number) => R;
                toMatchCloseTo: (expected: number | number[] | object, decimals?: number) => R;
            }
        }
    }

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
