import type { FastifyReply } from "fastify";

export function success<T>(
  reply: FastifyReply,
  data: T,
  message = "Success",
  statusCode = 200
) {
  return reply.code(statusCode).send({
    success: true,
    message,
    data,
  });
}

export function error(
  reply: FastifyReply,
  message: string,
  statusCode = 400,
  details?: unknown
) {
  return reply.code(statusCode).send({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
