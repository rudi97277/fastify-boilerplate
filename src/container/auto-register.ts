// src/di/auto-register.ts
import { diContainer } from "@fastify/awilix";
import type { AwilixContainer } from "awilix";
import { asClass, InjectionMode, Lifetime } from "awilix";
import fg from "fast-glob";
import path from "node:path";
import { rememberToken } from "./di-registry";

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
      // @ts-ignore runtime check
      value.prototype &&
      Object.prototype.hasOwnProperty.call(value.prototype, "constructor"))
  );
};

// Decide which extensions to scan at runtime (.ts in dev, .js after build)
const extGroup = path.extname(__filename) === ".ts" ? "{ts,js}" : "js";

const patterns = [
  `**/*.controller.${extGroup}`,
  `**/*.service.${extGroup}`,
  `**/*.repository.${extGroup}`,
];

export const autoRegisterComponents = async (
  container: AwilixContainer = diContainer
) => {
  // already done for this container? bail
  if (registeredContainers.has(container)) return;

  const modulesDir = path.resolve(__dirname, "../modules");
  const registeredNames = new Set(
    container.registrations ? Object.keys(container.registrations) : []
  );

  // 1) Find files — and WAIT
  const entries = await fg(patterns, {
    cwd: modulesDir,
    absolute: true,
    ignore: ["**/*.d.ts", "**/*.map"],
  });

  // 2) Register every class export — and WAIT
  for (const entry of entries) {
    // If your build outputs ESM, swap to: const moduleExports = await import(pathToFileURL(entry).href)
    // For CJS output, require() is fine:
    const moduleExports = require(entry);

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
        // skip duplicates (hot reload / multi-exports)
        continue;
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
  }

  // 3) Mark done only AFTER successful registration
  registeredContainers.add(container);
};
