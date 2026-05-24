declare function describe (name: string, fn: () => void): void
declare function it (name: string, fn: () => void): void

interface TestMatcher {
    toBe: (expected: unknown) => void
    toBeCloseTo: (expected: number) => void
    toBeGreaterThan: (expected: number) => void
    toBeInstanceOf: (expected: new (...args: any[]) => unknown) => void
    toHaveLength: (expected: number) => void
}

declare function expect (actual: unknown): TestMatcher