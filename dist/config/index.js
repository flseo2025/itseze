"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod_1 = require("zod");
const configSchema = zod_1.z.object({
    env: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    port: zod_1.z.coerce.number().default(3000),
    version: zod_1.z.string().default('1.0.0'),
    logLevel: zod_1.z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    database: zod_1.z.object({
        host: zod_1.z.string().default('localhost'),
        port: zod_1.z.coerce.number().default(5432),
        name: zod_1.z.string().default('itseze'),
        username: zod_1.z.string().optional(),
        password: zod_1.z.string().optional(),
    }).optional(),
});
function createConfig() {
    const rawConfig = {
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        version: process.env.npm_package_version,
        logLevel: process.env.LOG_LEVEL,
        database: {
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            name: process.env.DATABASE_NAME,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
        },
    };
    const result = configSchema.safeParse(rawConfig);
    if (!result.success) {
        console.error('Invalid configuration:', result.error.issues);
        throw new Error('Configuration validation failed');
    }
    return result.data;
}
exports.config = createConfig();
//# sourceMappingURL=index.js.map