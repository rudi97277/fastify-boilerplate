import { AppInstance } from "@/app.types";
import { postDocs } from "@/docs/posts.docs";
import { from, handler } from "@/modules/controller-handler";
import { PostController } from "@/modules/posts/post.controller";
import {
  CreatePostInput,
  PostIdParams,
  UpdatePostInput,
} from "@/modules/posts/post.schemas";

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
