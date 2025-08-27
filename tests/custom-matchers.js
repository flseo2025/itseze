"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
globals_1.expect.extend({
    toBeValidEmail(received) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pass = emailRegex.test(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid email`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be a valid email`,
                pass: false,
            };
        }
    },
});
globals_1.expect.extend({
    toBeValidUrl(received) {
        try {
            new URL(received);
            return {
                message: () => `expected ${received} not to be a valid URL`,
                pass: true,
            };
        }
        catch {
            return {
                message: () => `expected ${received} to be a valid URL`,
                pass: false,
            };
        }
    },
});
globals_1.expect.extend({
    toBeValidUuid(received) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const pass = uuidRegex.test(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid UUID`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be a valid UUID`,
                pass: false,
            };
        }
    },
});
globals_1.expect.extend({
    toBeValidISODate(received) {
        const date = new Date(received);
        const isValidDate = !isNaN(date.getTime());
        const isISOFormat = received === date.toISOString();
        const pass = isValidDate && isISOFormat;
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid ISO date`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be a valid ISO date`,
                pass: false,
            };
        }
    },
});
globals_1.expect.extend({
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false,
            };
        }
    },
});
globals_1.expect.extend({
    toHaveBeenCalledWithObjectContaining(received, expected) {
        const mockCalls = received.mock?.calls || [];
        const pass = mockCalls.some((call) => call.some((arg) => typeof arg === 'object' &&
            arg !== null &&
            Object.keys(expected).every(key => arg[key] === expected[key])));
        if (pass) {
            return {
                message: () => `expected mock not to be called with object containing ${JSON.stringify(expected)}`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected mock to be called with object containing ${JSON.stringify(expected)}`,
                pass: false,
            };
        }
    },
});
globals_1.expect.extend({
    toBeAsyncFunction(received) {
        const pass = typeof received === 'function' &&
            received.constructor.name === 'AsyncFunction';
        if (pass) {
            return {
                message: () => `expected function not to be async`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected function to be async`,
                pass: false,
            };
        }
    },
});
globals_1.expect.extend({
    toBeValidPassword(received) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const pass = passwordRegex.test(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid password`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be a valid password (8+ chars, 1 upper, 1 lower, 1 number, 1 special)`,
                pass: false,
            };
        }
    },
});
//# sourceMappingURL=custom-matchers.js.map