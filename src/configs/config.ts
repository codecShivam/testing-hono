import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  host: z.string().default('0.0.0.0'),
  port: z.coerce.number().default(3000),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  databaseUrl: z.string(),
  apiVersion: z.string().default('v1'),
  jwtSecret: z.string().optional(),
  loggingEnabled: z.coerce.boolean().default(true),
});

export type Config = z.infer<typeof configSchema>;

export const config = configSchema.parse({
  host: process.env.HOST,
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  apiVersion: process.env.API_VERSION,
  jwtSecret: process.env.JWT_SECRET,
  loggingEnabled: process.env.LOGGING_ENABLED,
}); 