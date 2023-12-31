import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
  }
}

const supabasePlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = fastify.config;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  fastify.decorate('supabase', supabase);
});

export default supabasePlugin;
