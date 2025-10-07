import { FastifyReply } from "fastify";

export class ApiError extends Error {
  public statusCode: number;
  public data?: unknown;

  constructor(statusCode: number, message: string, data?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }

  send(reply: FastifyReply) {
    return reply.status(this.statusCode).send({
      success: false,
      message: this.message,
      data: this.data ?? null,
    });
  }
}
