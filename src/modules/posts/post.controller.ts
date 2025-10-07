import type { FastifyReply, FastifyRequest } from "fastify";

import { PostService } from "@/modules/posts/post.service";
import {
  createPostSchema,
  postIdParamSchema,
  updatePostSchema,
  type PostIdParams,
  type UpdatePostInput,
} from "@/modules/posts/post.validation";
import { HttpStatus } from "@/utils/response.util";

export class PostController {
  constructor(private readonly postService: PostService) {}

  list = async (_request: FastifyRequest, reply: FastifyReply) => {
    const posts = await this.postService.list();
    reply.success(posts);
  };

  getById = async (
    request: FastifyRequest<{ Params: PostIdParams }>,
    reply: FastifyReply
  ) => {
    const { id } = postIdParamSchema.parse(request.params);
    const post = await this.postService.getById(id);

    reply.success(post, HttpStatus.CREATED);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createPostSchema.parse(request.body);
    const created = await this.postService.create(body);
    reply.success(created, HttpStatus.CREATED);
  };

  update = async (
    request: FastifyRequest<{ Params: PostIdParams; Body: UpdatePostInput }>,
    reply: FastifyReply
  ) => {
    const { id } = postIdParamSchema.parse(request.params);
    const body = updatePostSchema.parse(request.body);
    const updated = await this.postService.update(id, body);

    if (!updated) {
      return reply.fail("Post not found", HttpStatus.NOT_FOUND);
    }

    reply.success(updated);
  };

  remove = async (
    request: FastifyRequest<{ Params: PostIdParams }>,
    reply: FastifyReply
  ) => {
    const { id } = postIdParamSchema.parse(request.params);
    const deleted = await this.postService.delete(id);

    if (!deleted) {
      return reply.fail("Post not found", HttpStatus.OK);
    }

    reply.success();
  };
}
