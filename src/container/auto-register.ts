// src/di/auto-register.ts
import { diContainer } from "@fastify/awilix";
import type { AwilixContainer } from "awilix";
import { asClass, InjectionMode, Lifetime } from "awilix";
import fg from "fast-glob";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { rememberToken } from "./di-registry";

const patterns = [
  "**/*.controller.{ts,js}",
  "**/*.service.{ts,js}",
  "**/*.repository.{ts,js}",
];

export const lcFirst = (s: string) => (s ? s[0].toLowerCase() + s.slice(1) : s);

const toRegistrationName = (exportName: string, ctorName?: string): string => {
  const base = exportName === "default" && ctorName ? ctorName : exportName;
  return lcFirst(base);
};

const registeredContainers = new WeakSet<AwilixContainer>();

const isClass = (
  value: unknown
): value is new (...args: never[]) => unknown => {
  if (typeof value !== "function") return false;
  const src = Function.prototype.toString.call(value);
  return (
    src.startsWith("class ") ||
    ("prototype" in value &&
      value.prototype &&
      Object.prototype.hasOwnProperty.call(value.prototype, "constructor"))
  );
};

export const autoRegisterComponents = async (
  container: AwilixContainer = diContainer
): Promise<void> => {
  if (registeredContainers.has(container)) return;

  const modulesDir = path.resolve(__dirname, "../modules");
  const entries = await fg(patterns, {
    cwd: modulesDir,
    absolute: true,
    ignore: ["**/*.d.ts"],
  });

  const registeredNames = new Set(
    container.registrations ? Object.keys(container.registrations) : []
  );

  await Promise.all(
    entries.map(async (entry) => {
      const moduleExports = await import(pathToFileURL(entry).href);

      for (const [exportName, exportedValue] of Object.entries(moduleExports)) {
        if (!isClass(exportedValue)) continue;

        const ctor = exportedValue as new (...args: any[]) => unknown;
        const regName = toRegistrationName(exportName, ctor.name);

        if (!regName) {
          throw new Error(
            `Cannot infer DI name for export "${exportName}" in ${entry}`
          );
        }
        if (registeredNames.has(regName)) {
          throw new Error(
            `Duplicate DI registration name "${regName}" from ${entry}`
          );
        }

        container.register(
          regName,
          asClass(ctor, {
            lifetime: Lifetime.SINGLETON,
            injectionMode: InjectionMode.CLASSIC,
          })
        );

        rememberToken(ctor, regName);

        registeredNames.add(regName);
      }
    })
  );

  registeredContainers.add(container);
};
