import { message } from "@/constants/message.constant";
import { NewPost, Post } from "@/db/schema";
import { ApiError } from "@/errors/api-error";
import { PostRepository } from "@/modules/posts/post.repository";
import { HttpStatus } from "@/utils/response.util";
import type { Logger } from "pino";

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly logger: Logger
  ) {}

  async list(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async getById(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new ApiError(HttpStatus.NOT_FOUND, message.COMMON.NOT_FOUND);
    }

    return post;
  }

  async create(payload: NewPost): Promise<Post> {
    const created = await this.postRepository.create(payload);
    this.logger.info({ postId: created.id }, "post created");
    return created;
  }

  async update(id: number, payload: Partial<NewPost>): Promise<Post> {
    const updated = await this.postRepository.update(id, payload);

    if (!updated) {
      this.logger.warn({ postId: id }, "post not found");
      throw new ApiError(HttpStatus.NOT_FOUND, "Post Not Found");
    }

    this.logger.info({ postId: id }, "post updated");
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.postRepository.delete(id);

    if (!deleted) {
      throw new ApiError(HttpStatus.NOT_FOUND, "Post Not Found");
    }

    return deleted;
  }
}
