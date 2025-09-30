import { AppInstance } from "@/app.types";
import { storyDocs } from "@/docs/story.docs";
import { from } from "@/modules/controller-handler";
import {
  CreateStoryInput,
  StoryIdParams,
  UpdateStoryInput,
} from "@/modules/stories/stories.schemas";
import { StoryController } from "@/modules/stories/story.controller";

const ctrl = from(StoryController);

export default async (app: AppInstance): Promise<void> => {
  app.get("/", { schema: storyDocs.list }, ctrl("list"));

  app.get<{ Params: StoryIdParams }>(
    "/:id",
    { schema: storyDocs.getById },
    ctrl("getById")
  );

  app.post<{ Body: CreateStoryInput }>(
    "/",
    { schema: storyDocs.create },
    ctrl("create")
  );

  app.put<{ Params: StoryIdParams; Body: UpdateStoryInput }>(
    "/:id",
    { schema: storyDocs.update },
    ctrl("update")
  );

  app.delete<{ Params: StoryIdParams }>(
    "/:id",
    { schema: storyDocs.remove },
    ctrl("remove")
  );
};
