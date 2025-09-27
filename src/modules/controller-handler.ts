import type { FastifyReply, FastifyRequest } from "fastify";

export const withController = <Controller, Req extends FastifyRequest = FastifyRequest>(
  registrationName: string,
  handler: (controller: Controller, request: Req, reply: FastifyReply) => unknown | Promise<unknown>,
) => {
  return async (request: Req, reply: FastifyReply) => {
    const controller = request.diScope.resolve<Controller>(registrationName);
    return handler(controller, request, reply);
  };
};
