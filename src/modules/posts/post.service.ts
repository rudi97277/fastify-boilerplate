import { NewPost, Post } from "@/db/schema";
import { PostRepository } from "@/modules/posts/post.repository";
import type { Logger } from "pino";

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly logger: Logger
  ) {}

  async list(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async getById(id: number): Promise<Post | undefined> {
    return this.postRepository.findById(id);
  }

  async create(payload: NewPost): Promise<Post> {
    const created = await this.postRepository.create(payload);
    this.logger.info({ postId: created.id }, "post created");
    return created;
  }

  async update(
    id: number,
    payload: Partial<NewPost>
  ): Promise<Post | undefined> {
    const updated = await this.postRepository.update(id, payload);
    if (updated) {
      this.logger.info({ postId: id }, "post updated");
    }
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.postRepository.delete(id);
    if (deleted) {
      this.logger.info({ postId: id }, "post deleted");
    }
    return deleted;
  }
}
