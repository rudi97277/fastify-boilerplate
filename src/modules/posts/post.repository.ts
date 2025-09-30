import { desc, eq } from "drizzle-orm";

import { Database } from "@/container";
import { NewPost, Post, posts } from "@/db/schema";

export class PostRepository {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<Post[]> {
    return this.db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async findById(id: number): Promise<Post | undefined> {
    const [result] = await this.db.select().from(posts).where(eq(posts.id, id));
    return result;
  }

  async create(payload: NewPost): Promise<Post> {
    const [created] = await this.db.insert(posts).values(payload).returning();
    return created;
  }

  async update(
    id: number,
    payload: Partial<NewPost>
  ): Promise<Post | undefined> {
    const [updated] = await this.db
      .update(posts)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();

    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const [deleted] = await this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning({ id: posts.id });

    return Boolean(deleted);
  }
}
