import { DocsOf, wrapper } from "@/docs/common.docs";
import { PostController } from "@/modules/posts/post.controller";
import {
  createPostSchema,
  postIdParamSchema,
  updatePostSchema,
} from "@/modules/posts/post.validation";
import { toJSONSchema } from "@/utils/docs.util";

const postEntity = {
  type: "object",
  required: ["id", "title", "createdAt", "updatedAt"],
  additionalProperties: false,
  properties: {
    id: { type: "number" },
    title: { type: "string" },
    content: { type: "string", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

export const postDocs: DocsOf<PostController> = {
  list: {
    tags: ["posts"],
    summary: "List posts",
    response: {
      200: wrapper(postEntity, { isArray: true }),
    },
  },
  getById: {
    tags: ["posts"],
    summary: "Get post by id",
    params: toJSONSchema(postIdParamSchema),
    response: {
      200: postEntity,
      404: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },
  create: {
    tags: ["posts"],
    summary: "Create post",
    body: toJSONSchema(createPostSchema),
    response: {
      201: postEntity,
    },
  },
  update: {
    tags: ["posts"],
    summary: "Update post",
    params: toJSONSchema(postIdParamSchema),
    body: toJSONSchema(updatePostSchema),
    response: {
      200: postEntity,
      404: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },
  remove: {
    tags: ["posts"],
    summary: "Delete post",
    params: toJSONSchema(postIdParamSchema),
    response: {
      204: {
        type: "null",
        description: "Post deleted",
      },
      404: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },
} as const;
