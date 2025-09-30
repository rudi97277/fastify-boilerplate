import { diContainer } from "@fastify/awilix";

export type Ctor<T = unknown> = abstract new (...args: any[]) => T;

const ctorToToken = new WeakMap<Ctor, string | symbol>();

export const rememberToken = <T>(
  ctor: Ctor<T>,
  token: string | symbol
): void => {
  ctorToToken.set(ctor, token);
};

const lcFirst = (s: string) => (s ? s[0].toLowerCase() + s.slice(1) : s);

export const toToken = <T>(key: string | symbol | Ctor<T>): string | symbol => {
  if (typeof key === "string" || typeof key === "symbol") return key;

  const mapped = ctorToToken.get(key as Ctor);
  if (mapped) return mapped;

  const byName = lcFirst((key as Ctor).name || "");
  if (
    byName &&
    diContainer.registrations &&
    diContainer.registrations[byName]
  ) {
    return byName;
  }

  const name = (key as Ctor).name || "<anonymous>";
  throw new Error(
    `No DI token found for constructor ${name}. ` +
      `Check that autoRegisterComponents() ran, and the same module specifier is used.`
  );
};
