import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import Env from '@fastify/env';

const configSchema = Type.Object({
  DATABASE_URL: Type.String(),
  COOKIE_SECRET: Type.String(),
  JWT_SECRET: Type.String(),
  ENV: Type.Union([Type.Literal('production'), Type.Literal('development'), Type.Literal('test')]),
  NODE_ENV: Type.Literal('production'),
});

declare module 'fastify' {
  interface FastifyInstance {
    config: Static<typeof configSchema> & { ENV: string };
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    export interface ProcessEnv extends Static<typeof configSchema> {}
  }
}

const loadDotenv = async () => {
  if (process.env.ENV === 'production') return;
  const dotenv = await import('dotenv');
  dotenv.config({ path: `.env.${process.env.ENV}` });
};

const configPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await loadDotenv();
  await fastify.register(Env, {
    schema: configSchema,
  });
});

export default configPlugin;
