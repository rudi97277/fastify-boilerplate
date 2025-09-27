import fg from "fast-glob";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { diContainer } from "@fastify/awilix";
import type { AwilixContainer } from "awilix";
import { asClass, InjectionMode, Lifetime } from "awilix";

const patterns = [
  "**/*.controller.{ts,js}",
  "**/*.service.{ts,js}",
  "**/*.repository.{ts,js}",
];

const toRegistrationName = (exportName: string): string =>
  exportName.length > 0 ? exportName[0].toLowerCase() + exportName.slice(1) : exportName;

const registeredContainers = new WeakSet<AwilixContainer>();

const isClass = (value: unknown): value is new (...args: never[]) => unknown => {
  if (typeof value !== "function") {
    return false;
  }
  const fnString = Function.prototype.toString.call(value);
  return fnString.startsWith("class ");
};

export const autoRegisterComponents = async (container: AwilixContainer = diContainer): Promise<void> => {
  if (registeredContainers.has(container)) {
    return;
  }

  const modulesDir = path.resolve(__dirname, "../modules");

  const entries = await fg(patterns, {
    cwd: modulesDir,
    absolute: true,
    ignore: ["**/*.d.ts"],
  });

  const registeredNames = new Set(container.registrations ? Object.keys(container.registrations) : []);

  await Promise.all(
    entries.map(async (entry) => {
      const moduleExports = await import(pathToFileURL(entry).href);

      Object.entries(moduleExports).forEach(([exportName, exportedValue]) => {
        if (!isClass(exportedValue)) {
          return;
        }

        const registrationName = toRegistrationName(exportName);

        if (registeredNames.has(registrationName)) {
          throw new Error(
            `Duplicate DI registration name detected: "${registrationName}" from ${entry}. Ensure unique class names.`,
          );
        }

        container.register(
          registrationName,
          asClass(exportedValue, {
            lifetime: Lifetime.SINGLETON,
            injectionMode: InjectionMode.CLASSIC,
          }),
        );
        registeredNames.add(registrationName);
      });
    }),
  );

  registeredContainers.add(container);
};
