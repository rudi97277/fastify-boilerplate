import type { AppInstance } from "../../app.types";
import { storyDocs } from "../../docs/story.docs";
import type { CreateStoryInput, StoryIdParams, UpdateStoryInput } from "./stories.schemas";
import type { StoryController } from "./story.controller";

declare module "fastify" {
  interface FastifyRequest {
    storyController: StoryController;
  }
}

const controllerName = "storyController" as const;

export const registerStoryRoutes = async (app: AppInstance): Promise<void> => {
  await app.register(async (instance) => {
    instance.decorateRequest("storyController", null);

    instance.addHook("preHandler", (request, _reply, done) => {
      request.storyController = request.diScope.resolve<StoryController>(controllerName);
      done();
    });

    instance.get(
      "/stories",
      { schema: storyDocs.list },
      async (request) => request.storyController.list(),
    );

    instance.get<{ Params: StoryIdParams }>(
      "/stories/:id",
      { schema: storyDocs.getById },
      async (request, reply) => request.storyController.getById(request, reply),
    );

    instance.post<{ Body: CreateStoryInput }>(
      "/stories",
      { schema: storyDocs.create },
      async (request, reply) => request.storyController.create(request, reply),
    );

    instance.put<{ Params: StoryIdParams; Body: UpdateStoryInput }>(
      "/stories/:id",
      { schema: storyDocs.update },
      async (request, reply) => request.storyController.update(request, reply),
    );

    instance.delete<{ Params: StoryIdParams }>(
      "/stories/:id",
      { schema: storyDocs.remove },
      async (request, reply) => request.storyController.remove(request, reply),
    );
  });
};
