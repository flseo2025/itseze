/**
 * Application configuration
 */

import { z } from 'zod';

const configSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  version: z.string().default('1.0.0'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  database: z
    .object({
      host: z.string().default('localhost'),
      port: z.coerce.number().default(5432),
      name: z.string().default('itseze'),
      username: z.string().optional(),
      password: z.string().optional(),
    })
    .optional(),
});

export type Config = z.infer<typeof configSchema>;

function createConfig(): Config {
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

export const config = createConfig();
