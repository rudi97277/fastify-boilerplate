import { successEntity } from "@/docs/common.docs";
import type { FastifySchema } from "fastify";

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

const idParam = {
  type: "object",
  required: ["id"],
  additionalProperties: false,
  properties: {
    id: { type: "number" },
  },
} as const;

const postBody = {
  type: "object",
  required: ["title"],
  additionalProperties: false,
  properties: {
    title: { type: "string", minLength: 1, maxLength: 256 },
    content: { type: "string" },
  },
} as const;

const postUpdateBody = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", minLength: 1, maxLength: 256 },
    content: { type: "string" },
  },
} as const;

export const postDocs: Record<string, FastifySchema> = {
  list: {
    tags: ["posts"],
    summary: "List posts",
    response: {
      200: successEntity(postEntity, true),
    },
  },
  getById: {
    tags: ["posts"],
    summary: "Get post by id",
    params: idParam,
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
    body: postBody,
    response: {
      201: postEntity,
    },
  },
  update: {
    tags: ["posts"],
    summary: "Update post",
    params: idParam,
    body: postUpdateBody,
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
    params: idParam,
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
};
