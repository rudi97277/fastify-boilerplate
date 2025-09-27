import type { AppInstance } from "../app.types";
import { registerPostRoutes } from "./posts/post.routes";
import { registerStoryRoutes } from "./stories/story.routes";

export const registerModules = async (app: AppInstance): Promise<void> => {
  await registerPostRoutes(app);
  await registerStoryRoutes(app);
};
