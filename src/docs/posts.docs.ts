import { makeDocs, wrap } from "@/docs/common.docs";
import { PostController } from "@/modules/posts/post.controller";
import {
  createPostSchema,
  postIdParamSchema,
  updatePostSchema,
} from "@/modules/posts/post.validation";
import { HttpStatus } from "@/utils/response.util";
import z from "zod";

const postEntity = z.object({
  id: z.coerce.number().positive(),
  title: z.string(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const postDocs = makeDocs<PostController>("Posts")({
  list: {
    summary: "List posts",
    response: {
      [HttpStatus.OK]: wrap(postEntity.array()),
      [HttpStatus.NOT_FOUND]: wrap(z.null(), {
        success: false,
        message: "Data tidak ditemukan",
      }),
      [HttpStatus.INTERNAL_SERVER_ERROR]: wrap(z.null(), {
        success: false,
        message: "Halo",
      }),
    },
  },
  getById: {
    summary: "Get post by id",
    params: postIdParamSchema,
    response: {
      200: postEntity,
    },
  },
  create: {
    summary: "Create post",
    body: createPostSchema,
    response: {
      201: postEntity,
    },
  },
  update: {
    summary: "Update post",
    params: postIdParamSchema,
    body: updatePostSchema,
    response: {
      200: postEntity,
    },
  },
  remove: {
    summary: "Delete post",
    params: postIdParamSchema,
  },
});
