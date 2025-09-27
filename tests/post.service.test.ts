import type { Logger } from "pino";

import type { NewPost, Post } from "../src/db/schema";
import { PostService } from "../src/modules/posts/post.service";

describe("PostService", () => {
  const repository = {
    findAll: jest.fn<Promise<Post[]>, []>(),
    findById: jest.fn<Promise<Post | undefined>, [number]>(),
    create: jest.fn<Promise<Post>, [NewPost]>(),
    update: jest.fn<Promise<Post | undefined>, [number, Partial<NewPost>]>(),
    delete: jest.fn<Promise<boolean>, [number]>(),
  };

  const logger: Pick<Logger, "info"> = {
    info: jest.fn(),
  };

  const service = new PostService(repository as never, logger as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists posts via repository", async () => {
    const posts: Post[] = [
      {
        id: 1,
        title: "Test",
        content: "Body",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    repository.findAll.mockResolvedValue(posts);

    await expect(service.list()).resolves.toEqual(posts);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it("logs on create", async () => {
    const payload: NewPost = { title: "Test", content: "Body" };
    const created: Post = {
      id: 1,
      title: payload.title,
      content: payload.content ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repository.create.mockResolvedValue(created);

    await expect(service.create(payload)).resolves.toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(payload);
    expect(logger.info).toHaveBeenCalledWith({ postId: created.id }, "post created");
  });

  it("returns false when delete fails", async () => {
    repository.delete.mockResolvedValue(false);

    await expect(service.delete(1)).resolves.toBe(false);
    expect(logger.info).not.toHaveBeenCalled();
  });
});
