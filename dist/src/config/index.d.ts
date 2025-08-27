import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    env: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    port: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    version: z.ZodDefault<z.ZodString>;
    logLevel: z.ZodDefault<z.ZodEnum<{
        debug: "debug";
        info: "info";
        warn: "warn";
        error: "error";
    }>>;
    database: z.ZodOptional<z.ZodObject<{
        host: z.ZodDefault<z.ZodString>;
        port: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        name: z.ZodDefault<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Config = z.infer<typeof configSchema>;
export declare const config: {
    env: "development" | "production" | "test";
    port: number;
    version: string;
    logLevel: "debug" | "info" | "warn" | "error";
    database?: {
        host: string;
        port: number;
        name: string;
        username?: string | undefined;
        password?: string | undefined;
    } | undefined;
};
export {};
//# sourceMappingURL=index.d.ts.map