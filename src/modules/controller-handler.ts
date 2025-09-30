import type { FastifyReply, FastifyRequest } from "fastify";
import { toToken } from "../container/di-registry";

export const withController = <
  Controller,
  Req extends FastifyRequest = FastifyRequest
>(
  registrationName: string,
  handler: (
    controller: Controller,
    request: Req,
    reply: FastifyReply
  ) => unknown | Promise<unknown>
) => {
  return async (request: Req, reply: FastifyReply) => {
    const controller = request.diScope.resolve<Controller>(registrationName);
    return handler(controller, request, reply);
  };
};

type MethodKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export function handler<T extends object>(
  key: string | symbol | (abstract new (...args: any[]) => T),
  method: MethodKeys<T>
) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const token = toToken<T>(key);
    const c = req.diScope.resolve(token) as T;
    const fn = c[method] as unknown as (...args: any[]) => any;

    // works for 0-arg (extras ignored) and 2-arg handlers
    return fn.call(c, req, reply);
  };
}

export const from = <T extends object>(
  key: string | symbol | (abstract new (...args: any[]) => T)
) => {
  return (method: MethodKeys<T>) => handler<T>(key, method);
};
