import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
  }
}

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = process.env;
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const supabasePlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  fastify.decorate('supabase', supabase);
});

export default supabasePlugin;
