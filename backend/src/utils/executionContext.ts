import { AsyncLocalStorage } from 'async_hooks';

export type RequestContext = { sessionId?: string; requestId?: string };
export const executionContext = new AsyncLocalStorage<RequestContext>();
