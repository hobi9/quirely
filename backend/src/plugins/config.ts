import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import Env from '@fastify/env';

const loadDotenv = async () => {
  if (process.env.NODE_ENV === 'production') return;
  const dotenv = await import('dotenv');
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
};

const configSchema = Type.Object({
  DATABASE_URL: Type.String(),
  COOKIE_SECRET: Type.String(),
  JWT_SECRET: Type.String(),
});
declare module 'fastify' {
  interface FastifyInstance {
    config: Static<typeof configSchema> & { NODE_ENV: string };
  }
}

const configPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await loadDotenv();
  await fastify.register(Env, {
    schema: configSchema,
  });
});

export default configPlugin;
