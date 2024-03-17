import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContext = { sessionId?: string; requestId?: string };
export const executionContext = new AsyncLocalStorage<RequestContext>();
