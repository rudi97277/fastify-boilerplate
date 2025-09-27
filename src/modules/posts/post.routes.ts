import type { FastifyRequest } from "fastify";

import type { AppInstance } from "../../app.types";
import { postDocs } from "../../docs/posts.docs";
import { withController } from "../controller-handler";
import type { PostController } from "./post.controller";
import type {
  CreatePostInput,
  PostIdParams,
  UpdatePostInput,
} from "./post.schemas";

const controllerName = "postController" as const;

export const registerPostRoutes = async (app: AppInstance): Promise<void> => {
  app.get(
    "/posts",
    { schema: postDocs.list },
    withController<PostController>(controllerName, (controller) =>
      controller.list()
    )
  );

  app.get<{ Params: PostIdParams }>(
    "/posts/:id",
    { schema: postDocs.getById },
    withController<PostController, FastifyRequest<{ Params: PostIdParams }>>(
      controllerName,
      (controller, request, reply) => controller.getById(request, reply)
    )
  );

  app.post<{ Body: CreatePostInput }>(
    "/posts",
    { schema: postDocs.create },
    withController<PostController, FastifyRequest<{ Body: CreatePostInput }>>(
      controllerName,
      (controller, request, reply) => controller.create(request, reply)
    )
  );

  app.put<{ Params: PostIdParams; Body: UpdatePostInput }>(
    "/posts/:id",
    { schema: postDocs.update },
    withController<
      PostController,
      FastifyRequest<{ Params: PostIdParams; Body: UpdatePostInput }>
    >(controllerName, (controller, request, reply) =>
      controller.update(request, reply)
    )
  );

  app.delete<{ Params: PostIdParams }>(
    "/posts/:id",
    { schema: postDocs.remove },
    withController<PostController, FastifyRequest<{ Params: PostIdParams }>>(
      controllerName,
      (controller, request, reply) => controller.remove(request, reply)
    )
  );
};
