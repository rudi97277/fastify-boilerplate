import type { FastifyReply, FastifyRequest } from "fastify";

import { createStorySchema, storyIdParamSchema, updateStorySchema, type CreateStoryInput, type StoryIdParams, type UpdateStoryInput } from "./stories.schemas";
// biome-ignore lint/style/useImportType: runtime awilix instantiation
import { StoryService } from "./story.service";

export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  list = async () => {
    return this.storyService.list();
  };

  getById = async (request: FastifyRequest<{ Params: StoryIdParams }>, reply: FastifyReply) => {
    const { id } = storyIdParamSchema.parse(request.params);
    const story = await this.storyService.getById(id);

    if (!story) {
      return reply.code(404).send({ message: "Story not found" });
    }

    return story;
  };

  create = async (request: FastifyRequest<{ Body: CreateStoryInput }>, reply: FastifyReply) => {
    const body = createStorySchema.parse(request.body);
    const created = await this.storyService.create(body);
    return reply.code(201).send(created);
  };

  update = async (
    request: FastifyRequest<{ Params: StoryIdParams; Body: UpdateStoryInput }>,
    reply: FastifyReply,
  ) => {
    const { id } = storyIdParamSchema.parse(request.params);
    const body = updateStorySchema.parse(request.body);
    const updated = await this.storyService.update(id, body);

    if (!updated) {
      return reply.code(404).send({ message: "Story not found" });
    }

    return updated;
  };

  remove = async (request: FastifyRequest<{ Params: StoryIdParams }>, reply: FastifyReply) => {
    const { id } = storyIdParamSchema.parse(request.params);
    const deleted = await this.storyService.delete(id);

    if (!deleted) {
      return reply.code(404).send({ message: "Story not found" });
    }

    return reply.code(204).send();
  };
}
