import Fastify from 'fastify';
import App from './app';

const fastify = Fastify({
  logger: true,
});

fastify.register(App);

fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
