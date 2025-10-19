import type { FastifyInstance } from "fastify";
import type {
  Server as HttpServer,
  IncomingMessage,
  ServerResponse,
} from "node:http";
import type { Logger } from "pino";
import z from "zod";

export type AppInstance = FastifyInstance<
  HttpServer,
  IncomingMessage,
  ServerResponse,
  Logger
>;

export type Out<T extends z.ZodTypeAny> = z.output<T>;
