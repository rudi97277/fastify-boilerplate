import { Database } from "@/container";
import { NewStory, stories, Story } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export class StoryRepository {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<Story[]> {
    return this.db.select().from(stories).orderBy(desc(stories.createdAt));
  }

  async findById(id: number): Promise<Story | undefined> {
    const [result] = await this.db
      .select()
      .from(stories)
      .where(eq(stories.id, id));
    return result;
  }

  async create(payload: NewStory): Promise<Story> {
    const [created] = await this.db.insert(stories).values(payload).returning();
    return created;
  }

  async update(
    id: number,
    payload: Partial<NewStory>
  ): Promise<Story | undefined> {
    const [updated] = await this.db
      .update(stories)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(stories.id, id))
      .returning();

    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const [deleted] = await this.db
      .delete(stories)
      .where(eq(stories.id, id))
      .returning({ id: stories.id });

    return Boolean(deleted);
  }
}
