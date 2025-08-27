#!/usr/bin/env node
declare class Application {
    private cli;
    private configService;
    private logger;
    constructor();
    start(): Promise<void>;
    shutdown(): Promise<void>;
}
export { Application };
//# sourceMappingURL=index.d.ts.map