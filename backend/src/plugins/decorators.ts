import { FastifyReply } from 'fastify';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyReply {
    sendValidationError: <Schema>(status: number, opts: SendErrorOpts<Schema>) => FastifyReply;
    sendError: (status: number, message: string) => FastifyReply;
  }

  interface FastifyInstance {
    genSalt: (rounds?: number) => Promise<string>;
    compareHash: (s1: string, s2: string) => Promise<boolean>;
    hash: (toHash: string, salt: string) => Promise<string>;
    isTokenExpiredError: (err: unknown) => boolean;
    createToken: (opts: { payload: string | object | Buffer; secret: string; duration?: string | number }) => string;
    verifyToken: <T extends string | object | Buffer>(opts: { token: string; secret: string }) => T;
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

  fastify.decorate('genSalt', (rounds?: number) => bcrypt.genSalt(rounds));
  fastify.decorate('compareHash', (s1, s2) => bcrypt.compare(s1, s2));
  fastify.decorate('hash', (toHash, salt) => bcrypt.hash(toHash, salt));

  fastify.decorate(
    'createToken',
    ({
      payload,
      secret,
      duration,
    }: {
      payload: string | object | Buffer;
      secret: string;
      duration?: string | number;
    }) => {
      return jwt.sign(payload, secret, { expiresIn: duration });
    },
  );

  fastify.decorate(
    'verifyToken',
    <T extends string | object | Buffer>({ token, secret }: { token: string; secret: string }) => {
      return jwt.verify(token, secret) as T;
    },
  );
});

export default miscDecorators;
