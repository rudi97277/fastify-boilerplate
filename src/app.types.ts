import type { FastifyInstance } from "fastify";
import type { IncomingMessage, Server as HttpServer, ServerResponse } from "node:http";
import type { Logger } from "pino";

export type AppInstance = FastifyInstance<HttpServer, IncomingMessage, ServerResponse, Logger>;
