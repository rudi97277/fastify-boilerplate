import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { asValue } from "awilix";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import type { AppInstance } from "../app.types";
import { env } from "../config/env";
import * as schema from "../db/schema";
import { autoRegisterComponents } from "./auto-register";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle(pool, { schema });

export type Database = typeof db;

export const setupDI = async (app: AppInstance): Promise<void> => {
  diContainer.register({
    logger: asValue(app.log),
    pool: asValue(pool),
    db: asValue(db),
  });

  await autoRegisterComponents();

  await app.register(fastifyAwilixPlugin, {
    container: diContainer,
    disposeOnClose: true,
    disposeOnResponse: false,
  });
};

export const closeContainer = async (): Promise<void> => {
  await pool.end();
};
