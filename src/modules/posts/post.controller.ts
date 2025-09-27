import type { FastifyReply, FastifyRequest } from "fastify";

import { createPostSchema, postIdParamSchema, updatePostSchema, type CreatePostInput, type PostIdParams, type UpdatePostInput } from "./post.schemas";
// biome-ignore lint/style/useImportType: runtime awilix instantiation
import { PostService } from "./post.service";

export class PostController {
  constructor(private readonly postService: PostService) {}

  list = async () => {
    return this.postService.list();
  };

  getById = async (request: FastifyRequest<{ Params: PostIdParams }>, reply: FastifyReply) => {
    const { id } = postIdParamSchema.parse(request.params);
    const post = await this.postService.getById(id);

    if (!post) {
      return reply.code(404).send({ message: "Post not found" });
    }

    return post;
  };

  create = async (request: FastifyRequest<{ Body: CreatePostInput }>, reply: FastifyReply) => {
    const body = createPostSchema.parse(request.body);
    const created = await this.postService.create(body);
    return reply.code(201).send(created);
  };

  update = async (
    request: FastifyRequest<{ Params: PostIdParams; Body: UpdatePostInput }>,
    reply: FastifyReply,
  ) => {
    const { id } = postIdParamSchema.parse(request.params);
    const body = updatePostSchema.parse(request.body);
    const updated = await this.postService.update(id, body);

    if (!updated) {
      return reply.code(404).send({ message: "Post not found" });
    }

    return updated;
  };

  remove = async (request: FastifyRequest<{ Params: PostIdParams }>, reply: FastifyReply) => {
    const { id } = postIdParamSchema.parse(request.params);
    const deleted = await this.postService.delete(id);

    if (!deleted) {
      return reply.code(404).send({ message: "Post not found" });
    }

    return reply.code(204).send();
  };
}
