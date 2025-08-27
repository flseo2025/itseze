"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
require("jest-extended");
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;
beforeEach(() => {
    globals_1.jest.clearAllMocks();
    globals_1.jest.resetModules();
    console.error = globals_1.jest.fn();
    console.warn = globals_1.jest.fn();
    console.log = globals_1.jest.fn();
});
afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
    console.log = originalLog;
    globals_1.jest.clearAllTimers();
    globals_1.jest.useRealTimers();
});
globals_1.jest.setTimeout(10000);
const originalConsoleError = console.error;
console.error = (...args) => {
    if (typeof args[0] === 'string' &&
        args[0].includes('Warning: ReactDOM.render is no longer supported')) {
        return;
    }
    originalConsoleError.call(console, ...args);
};
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';
if (!global.fetch) {
    global.fetch = globals_1.jest.fn();
}
const localStorageMock = {
    getItem: globals_1.jest.fn(),
    setItem: globals_1.jest.fn(),
    removeItem: globals_1.jest.fn(),
    clear: globals_1.jest.fn(),
    length: 0,
    key: globals_1.jest.fn()
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});
const sessionStorageMock = {
    getItem: globals_1.jest.fn(),
    setItem: globals_1.jest.fn(),
    removeItem: globals_1.jest.fn(),
    clear: globals_1.jest.fn(),
    length: 0,
    key: globals_1.jest.fn()
};
Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
});
afterAll(() => {
    localStorage.clear();
    sessionStorage.clear();
});
//# sourceMappingURL=setup.js.map