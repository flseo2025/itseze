"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performance = exports.assertions = exports.testSetup = exports.dbHelpers = exports.mockHttpResponse = exports.generateTestData = exports.sleep = exports.waitFor = exports.createPartialMock = exports.createMockFn = void 0;
const globals_1 = require("@jest/globals");
const createMockFn = () => {
    return globals_1.jest.fn();
};
exports.createMockFn = createMockFn;
const createPartialMock = (partial) => {
    return partial;
};
exports.createPartialMock = createPartialMock;
const waitFor = async (condition, timeout = 5000, interval = 100) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const result = await condition();
        if (result) {
            return;
        }
        await (0, exports.sleep)(interval);
    }
    throw new Error(`Condition not met within ${timeout}ms`);
};
exports.waitFor = waitFor;
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
exports.generateTestData = {
    user: (overrides = {}) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
        ...overrides
    }),
    post: (overrides = {}) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: 'Test Post',
        content: 'This is a test post content',
        authorId: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        ...overrides
    }),
    randomString: (length = 10) => {
        return Math.random().toString(36).substr(2, length);
    },
    randomNumber: (min = 1, max = 100) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomEmail: () => {
        const username = Math.random().toString(36).substr(2, 8);
        const domain = Math.random().toString(36).substr(2, 6);
        return `${username}@${domain}.com`;
    }
};
exports.mockHttpResponse = {
    success: (data, status = 200) => ({
        ok: true,
        status,
        json: async () => data,
        text: async () => JSON.stringify(data)
    }),
    error: (message = 'Error', status = 400) => ({
        ok: false,
        status,
        json: async () => ({ error: message }),
        text: async () => JSON.stringify({ error: message })
    })
};
exports.dbHelpers = {
    clearTables: async (...tableNames) => {
        console.log(`Clearing tables: ${tableNames.join(', ')}`);
    },
    seedData: async (tableName, data) => {
        console.log(`Seeding ${tableName} with ${data.length} records`);
    }
};
exports.testSetup = {
    mockConsole: () => {
        const originalConsole = { ...console };
        console.log = globals_1.jest.fn();
        console.error = globals_1.jest.fn();
        console.warn = globals_1.jest.fn();
        console.info = globals_1.jest.fn();
        return {
            restore: () => {
                Object.assign(console, originalConsole);
            }
        };
    },
    mockDate: (date) => {
        const mockDate = new Date(date);
        const originalDate = Date;
        global.Date = globals_1.jest.fn(() => mockDate);
        global.Date.now = globals_1.jest.fn(() => mockDate.getTime());
        return {
            restore: () => {
                global.Date = originalDate;
            }
        };
    },
    mockTimers: () => {
        globals_1.jest.useFakeTimers();
        return {
            advanceBy: (ms) => globals_1.jest.advanceTimersByTime(ms),
            runAll: () => globals_1.jest.runAllTimers(),
            restore: () => globals_1.jest.useRealTimers()
        };
    }
};
exports.assertions = {
    expectToThrowAsync: async (fn, expectedError) => {
        let error;
        try {
            await fn();
        }
        catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        if (expectedError) {
            if (typeof expectedError === 'string') {
                expect(error?.message).toContain(expectedError);
            }
            else {
                expect(error?.message).toMatch(expectedError);
            }
        }
    },
    expectArrayToContainObject: (array, object) => {
        expect(array).toContainEqual(expect.objectContaining(object));
    }
};
exports.performance = {
    measureTime: async (fn) => {
        const start = process.hrtime.bigint();
        const result = await fn();
        const end = process.hrtime.bigint();
        return {
            result,
            duration: Number(end - start) / 1000000
        };
    },
    expectToBeFasterThan: async (fn, maxDuration) => {
        const { duration } = await exports.performance.measureTime(fn);
        expect(duration).toBeLessThan(maxDuration);
    }
};
//# sourceMappingURL=test-helpers.js.map