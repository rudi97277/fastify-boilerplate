import { ApiResponse, HttpStatus } from "@/utils/response.util";
import type { FastifyInstance, FastifyReply } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyReply {
    success<T>(
      data?: T,
      statusCode?: HttpStatus,
      message?: string
    ): FastifyReply;
    fail(
      message: string,
      statusCode?: HttpStatus,
      data?: unknown
    ): FastifyReply;
  }
}

async function decorate(app: FastifyInstance) {
  app.decorateReply(
    "success",
    function <T>(
      this: FastifyReply,
      data: T,
      statusCode = HttpStatus.OK,
      message = "Request success"
      //
    ) {
      const payload: ApiResponse<T> = { success: true, message, data };
      return this.code(statusCode).send(payload);
    }
  );

  app.decorateReply(
    "fail",
    function (
      this: FastifyReply,
      message: string,
      statusCode = HttpStatus.BAD_REQUEST,
      data: unknown = null
    ) {
      const payload: ApiResponse = { success: false, message, data };
      return this.code(statusCode).send(payload);
    }
  );
}

export const replyDecorator = fp(decorate, {
  name: "reply-decorator",
});
