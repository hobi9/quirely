import { z } from 'zod';

const configSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  COOKIE_SECRET: z.string(),
  SESSION_SECRET: z.string(),
  JWT_EMAIL_SECRET: z.string(),
  ENV: z.enum(['production', 'development', 'test']),
  NODE_ENV: z.literal('production'),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  CLIENT_BASE_URL: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_ROLE: z.string(),
  SERVER_PORT: z.coerce.number(),
});

declare global {
  namespace NodeJS {
    export interface ProcessEnv extends EnvSchema {}
  }
}

type EnvSchema = z.infer<typeof configSchema>;
export type ENV = EnvSchema['ENV'];

export const validateEnvironment = () => {
  const parsedConfig = configSchema.safeParse(process.env);

  if (!parsedConfig.success) {
    const { fieldErrors } = parsedConfig.error.flatten();
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) => (errors ? `${field}: ${errors.join(',')}` : field))
      .join('\n');
    console.error('Error during env validation: \n', errorMessage);
    process.exit(-1);
  }
};
