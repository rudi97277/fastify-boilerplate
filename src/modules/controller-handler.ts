import { lcFirst } from "@/container/auto-register";
import { Ctor } from "@/container/di-registry";
import type { FastifyReply, FastifyRequest } from "fastify";

export type MethodKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export function from<T extends object>(key: string | Ctor<T>) {
  const token = typeof key === "string" ? key : key.name;

  return function <
    F extends (req: FastifyRequest<any>, rep: FastifyReply) => any
  >(pick: (c: T) => F) {
    return (async (req, rep) => {
      const ctrl = req.diScope.resolve<T>(lcFirst(token));
      const fn = pick(ctrl).bind(ctrl) as F;
      return fn(req, rep);
    }) as F;
  };
}
