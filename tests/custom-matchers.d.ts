declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValidEmail(): R;
            toBeValidUrl(): R;
            toBeValidUuid(): R;
            toBeValidISODate(): R;
            toBeWithinRange(floor: number, ceiling: number): R;
            toHaveBeenCalledWithObjectContaining(expected: Record<string, any>): R;
            toBeAsyncFunction(): R;
            toBeValidPassword(): R;
        }
    }
}
export {};
//# sourceMappingURL=custom-matchers.d.ts.map