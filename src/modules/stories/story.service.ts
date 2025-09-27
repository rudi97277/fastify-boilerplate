import type { Logger } from "pino";

import type { NewStory, Story } from "../../db/schema";
// biome-ignore lint/style/useImportType: runtime awilix instantiation
import { StoryRepository } from "./story.repository";

export class StoryService {
  constructor(
    private readonly storyRepository: StoryRepository,
    private readonly logger: Logger,
  ) {}

  async list(): Promise<Story[]> {
    return this.storyRepository.findAll();
  }

  async getById(id: number): Promise<Story | undefined> {
    return this.storyRepository.findById(id);
  }

  async create(payload: NewStory): Promise<Story> {
    const created = await this.storyRepository.create(payload);
    this.logger.info({ storyId: created.id }, "story created");
    return created;
  }

  async update(id: number, payload: Partial<NewStory>): Promise<Story | undefined> {
    const updated = await this.storyRepository.update(id, payload);
    if (updated) {
      this.logger.info({ storyId: id }, "story updated");
    }
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.storyRepository.delete(id);
    if (deleted) {
      this.logger.info({ storyId: id }, "story deleted");
    }
    return deleted;
  }
}
