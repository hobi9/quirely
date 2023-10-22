import { config } from '../schemas/configSchema';

declare module 'fastify' {
  interface FastifyInstance {
    config: config;
  }
}
