import { FastifyReply } from 'fastify';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';

declare module 'fastify' {
  interface FastifyReply {
    sendValidationError: <Schema>(status: number, opts: SendErrorOpts<Schema>) => void;
    sendError: (status: number, message: string) => void;
  }

  interface FastifyInstance {
    genSalt: (rounds?: number) => Promise<string>;
    compareHash: (s1: string, s2: string) => Promise<boolean>;
    hash: (toHash: string, salt: string) => Promise<string>;
  }
}

type SendErrorOpts<Schema> = { message: string; field?: keyof Schema };

type CustomError<Schema = Record<string, never>> = {
  statusCode: number;
  message: string;
  error: string;
  field?: keyof Schema;
};

const miscDecorators: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateReply('sendValidationError', function <
    Schema,
  >(this: FastifyReply, status: number, opts: SendErrorOpts<Schema>) {
    const customError: CustomError<Schema> = {
      statusCode: status,
      error: 'Validation',
      ...opts,
    };
    this.status(status);
    this.send(customError);
  });

  fastify.decorateReply('sendError', function (this: FastifyReply, status: number, message: string) {
    const customError: CustomError = {
      statusCode: status,
      error: 'Error',
      message,
    };
    this.status(status);
    this.send(customError);
  });

  fastify.decorate('genSalt', (rounds?: number) => bcrypt.genSalt(rounds));
  fastify.decorate('compareHash', (s1, s2) => bcrypt.compare(s1, s2));
  fastify.decorate('hash', (toHash, salt) => bcrypt.hash(toHash, salt));
});

export default miscDecorators;
