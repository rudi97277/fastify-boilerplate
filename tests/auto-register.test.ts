import { createContainer, asClass, Lifetime } from "awilix";

import { autoRegisterComponents } from "../src/container/auto-register";

describe("autoRegisterComponents", () => {
  it("registers controllers, services, and repositories", async () => {
    const container = createContainer();

    await autoRegisterComponents(container);

    expect(container.hasRegistration("postController")).toBe(true);
    expect(container.hasRegistration("postService")).toBe(true);
    expect(container.hasRegistration("postRepository")).toBe(true);
  });

  it("throws when a duplicate registration name is detected", async () => {
    const container = createContainer();

    container.register(
      "postController",
      asClass(
        class DuplicateController {},
        {
          lifetime: Lifetime.SINGLETON,
        },
      ),
    );

    await expect(autoRegisterComponents(container)).rejects.toThrow(/Duplicate DI registration name/);
  });
});
