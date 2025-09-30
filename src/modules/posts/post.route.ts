import type { AppInstance } from "../../app.types";
import { postDocs } from "../../docs/posts.docs";
import { from, handler } from "../controller-handler";
import { PostController } from "./post.controller";
import type {
  CreatePostInput,
  PostIdParams,
  UpdatePostInput,
} from "./post.schemas";

const ctrl = from(PostController);

export default async (app: AppInstance): Promise<void> => {
  app.get("", { schema: postDocs.list }, handler(PostController, "list"));

  app.post<{ Body: CreatePostInput }>(
    "",
    { schema: postDocs.create },
    ctrl("create")
  );

  app.get<{ Params: PostIdParams }>(
    "/:id",
    { schema: postDocs.getById },
    handler(PostController, "getById")
  );

  app.put<{ Params: PostIdParams; Body: UpdatePostInput }>(
    "/:id",
    { schema: postDocs.update },
    ctrl("update")
  );

  app.delete<{ Params: PostIdParams }>(
    "/:id",
    { schema: postDocs.remove },
    ctrl("remove")
  );
};
