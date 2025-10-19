import type { FastifyReply, FastifyRequest } from "fastify";

import { message } from "@/constants/message.constant";
import { PostService } from "@/modules/posts/post.service";
import {
  CreatePostBody,
  PostIdParam,
  UpdatePostBody,
} from "@/modules/posts/post.validation";
import { HttpStatus } from "@/utils/response.util";

export class PostController {
  constructor(private readonly postService: PostService) {}

  list = async (_request: FastifyRequest, reply: FastifyReply) => {
    const posts = await this.postService.list();
    reply.success(posts);
  };

  getById = async (
    request: FastifyRequest<{ Params: PostIdParam }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const post = await this.postService.getById(id);

    reply.success(post);
  };

  create = async (
    request: FastifyRequest<{ Body: CreatePostBody }>,
    reply: FastifyReply
  ) => {
    const body = request.body;
    const created = await this.postService.create(body);
    reply.success(created, HttpStatus.CREATED);
  };

  update = async (
    request: FastifyRequest<{
      Params: PostIdParam;
      Body: UpdatePostBody;
    }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const body = request.body;
    const updated = await this.postService.update(id, body);

    if (!updated) {
      return reply.fail(message.COMMON.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    reply.success(updated);
  };

  remove = async (
    request: FastifyRequest<{ Params: PostIdParam }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const deleted = await this.postService.delete(id);

    if (!deleted) {
      return reply.fail(message.COMMON.NOT_FOUND, HttpStatus.OK);
    }

    reply.success();
  };
}
