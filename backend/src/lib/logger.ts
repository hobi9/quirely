import pino, { type LoggerOptions } from 'pino';
import type { ENV } from '../config/config';
import { executionContext } from '../utils/executionContext';

type LoggerConfig = Record<ENV, LoggerOptions>;

const loggerConfig: LoggerConfig = {
  development: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
  production: {
    redact: ['[*].password'],
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
  test: {
    level: 'silent',
  },
};

const defaultConfig: LoggerOptions = {
  mixin() {
    return {
      ...executionContext.getStore(),
    };
  },
};

const opts: LoggerOptions = { ...defaultConfig, ...loggerConfig[process.env.ENV] };

export const logger = pino(opts);
