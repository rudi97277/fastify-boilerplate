import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";

import { replyDecorator } from "@/plugins/reply-decorator";
import { HttpStatus } from "@/utils/response.util";
import fastifyAutoload from "@fastify/autoload";
import path from "node:path";
import type { AppInstance } from "./app.types";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { setupDI } from "./container";
import { ApiError } from "./errors/api-error";

export async function buildApp(): Promise<AppInstance> {
  const app = Fastify({
    loggerInstance: logger,
    ajv: {
      customOptions: {
        allErrors: true,
      },
    },
  });

  await app.register(replyDecorator);

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof ApiError) {
      return err.send(reply);
    }

    reply.fail(
      err.message || "Internal Server Error",
      err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      err.validation
    );
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
          url: `http://localhost:${env.PORT}/api/v1`,
          description: "Local development",
        },
      ],
    },
  });

  await app.register(cors, {
    origin: ["*"],
    credentials: true,
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
    },
  });

  await app.register(
    async (scoped) => {
      await scoped.register(fastifyAutoload, {
        dir: path.join(__dirname, "modules"),
        dirNameRoutePrefix: true,
        indexPattern: /.*\.route\.(ts|js)$/,
      });
    },
    { prefix: "/api/v1" }
  );

  await setupDI(app);

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
