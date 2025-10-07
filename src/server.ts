import { buildApp } from "./app";
import type { AppInstance } from "./app.types";
import { env } from "./config/env";
import { closeContainer } from "./container";

let app: AppInstance | undefined;

const shutdown = async () => {
  if (app) {
    await app.close();
  }
  await closeContainer();
};

const start = async () => {
  app = await buildApp();

  await app.ready();

  process.on("SIGINT", async () => {
    app?.log.info("Received SIGINT, shutting down");
    await shutdown();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    app?.log.info("Received SIGTERM, shutting down");
    await shutdown();
    process.exit(0);
  });

  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info(`Server running on http://localhost:${env.PORT}`);
  } catch (error) {
    app.log.error(error, "Failed to start server");
    await shutdown();
    process.exit(1);
  }
};

void start();
