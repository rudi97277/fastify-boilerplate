import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import type { AppInstance } from "./app.types";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { setupDI } from "./container";
import { registerModules } from "./modules";

export async function buildApp(): Promise<AppInstance> {
  const app = Fastify({
    loggerInstance: logger,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Fastify Posts API",
        version: "1.0.0",
        description: "CRUD API for posts using Fastify, Drizzle, and awilix DI",
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: "Local development",
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
    },
  });

  app.get("/health", async () => ({ status: "ok" }));

  await setupDI(app);
  await registerModules(app);

  return app;
}
