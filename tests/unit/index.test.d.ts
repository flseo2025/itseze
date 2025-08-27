import { Application } from '../../src/index';
export declare class TestUtils {
    static createMockApplication(): Application;
    static waitFor(condition: () => boolean, timeout?: number): Promise<void>;
    static suppressConsole(): () => void;
}
//# sourceMappingURL=index.test.d.ts.map