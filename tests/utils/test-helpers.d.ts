import { jest } from '@jest/globals';
export declare const createMockFn: <T extends (...args: any[]) => any>() => jest.MockedFunction<T>;
export declare const createPartialMock: <T extends Record<string, any>>(partial: Partial<T>) => T;
export declare const waitFor: (condition: () => boolean | Promise<boolean>, timeout?: number, interval?: number) => Promise<void>;
export declare const sleep: (ms: number) => Promise<void>;
export declare const generateTestData: {
    user: (overrides?: Partial<any>) => {
        id: string;
        name: string;
        email: string;
        createdAt: string;
    };
    post: (overrides?: Partial<any>) => {
        id: string;
        title: string;
        content: string;
        authorId: string;
        createdAt: string;
    };
    randomString: (length?: number) => string;
    randomNumber: (min?: number, max?: number) => number;
    randomEmail: () => string;
};
export declare const mockHttpResponse: {
    success: <T>(data: T, status?: number) => {
        ok: boolean;
        status: number;
        json: () => Promise<T>;
        text: () => Promise<string>;
    };
    error: (message?: string, status?: number) => {
        ok: boolean;
        status: number;
        json: () => Promise<{
            error: string;
        }>;
        text: () => Promise<string>;
    };
};
export declare const dbHelpers: {
    clearTables: (...tableNames: string[]) => Promise<void>;
    seedData: (tableName: string, data: any[]) => Promise<void>;
};
export declare const testSetup: {
    mockConsole: () => {
        restore: () => void;
    };
    mockDate: (date: string | Date) => {
        restore: () => void;
    };
    mockTimers: () => {
        advanceBy: (ms: number) => void;
        runAll: () => void;
        restore: () => import("@jest/environment").Jest;
    };
};
export declare const assertions: {
    expectToThrowAsync: (fn: () => Promise<any>, expectedError?: string | RegExp) => Promise<void>;
    expectArrayToContainObject: (array: any[], object: Record<string, any>) => void;
};
export declare const performance: {
    measureTime: <T>(fn: () => Promise<T> | T) => Promise<{
        result: T;
        duration: number;
    }>;
    expectToBeFasterThan: (fn: () => Promise<any> | any, maxDuration: number) => Promise<void>;
};
//# sourceMappingURL=test-helpers.d.ts.map