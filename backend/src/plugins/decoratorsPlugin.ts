import { FastifyReply } from 'fastify';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyReply {
    sendValidationError: <Schema>(status: number, opts: SendErrorOpts<Schema>) => FastifyReply;
    sendError: (status: number, message: string) => FastifyReply;
  }
}

type SendErrorOpts<Schema> = { message: string; field?: keyof Schema };

type CustomError<Schema = Record<string, never>> = {
  statusCode: number;
  message: string;
  error: string;
  field?: keyof Schema;
};

const decoratorsPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateReply('sendValidationError', function <
    Schema,
  >(this: FastifyReply, status: number, opts: SendErrorOpts<Schema>) {
    const customError: CustomError<Schema> = {
      statusCode: status,
      error: 'Validation',
      ...opts,
    };
    return this.status(status).send(customError);
  });

  fastify.decorateReply('sendError', function (this: FastifyReply, status: number, message: string) {
    const customError: CustomError = {
      statusCode: status,
      error: 'Error',
      message,
    };
    return this.status(status).send(customError);
  });
});

export default decoratorsPlugin;
