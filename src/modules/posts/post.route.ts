import { AppInstance } from "@/app.types";
import { postDocs } from "@/docs/posts.docs";
import { from } from "@/modules/controller-handler";
import { PostController } from "@/modules/posts/post.controller";

const ctrl = from(PostController);

export default async (app: AppInstance): Promise<void> => {
  app.get(
    "",
    { schema: postDocs.list },
    ctrl((c) => c.list)
  );

  app.post(
    "",
    { schema: postDocs.create },
    ctrl((c) => c.create)
  );

  app.get(
    "/:id",
    { schema: postDocs.getById },
    ctrl((c) => c.getById)
  );

  app.put(
    "/:id",
    { schema: postDocs.update },
    ctrl((c) => c.update)
  );

  app.delete(
    "/:id",
    { schema: postDocs.remove },
    ctrl((c) => c.remove)
  );
};
