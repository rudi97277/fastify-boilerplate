import type { FastifySchema } from "fastify";

const storyEntity = {
  type: "object",
  required: ["id", "title", "body", "createdAt", "updatedAt"],
  additionalProperties: false,
  properties: {
    id: { type: "number" },
    title: { type: "string" },
    body: { type: "string" },
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

const storyBody = {
  type: "object",
  required: ["title", "body"],
  additionalProperties: false,
  properties: {
    title: { type: "string", minLength: 1, maxLength: 256 },
    body: { type: "string", minLength: 1 },
  },
} as const;

const storyUpdateBody = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", minLength: 1, maxLength: 256 },
    body: { type: "string", minLength: 1 },
  },
} as const;

export const storyDocs: Record<string, FastifySchema> = {
  list: {
    tags: ["stories"],
    summary: "List stories",
    response: {
      200: {
        type: "array",
        items: storyEntity,
      },
    },
  },
  getById: {
    tags: ["stories"],
    summary: "Get story by id",
    params: idParam,
    response: {
      200: storyEntity,
      404: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },
  create: {
    tags: ["stories"],
    summary: "Create story",
    body: storyBody,
    response: {
      201: storyEntity,
    },
  },
  update: {
    tags: ["stories"],
    summary: "Update story",
    params: idParam,
    body: storyUpdateBody,
    response: {
      200: storyEntity,
      404: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },
  remove: {
    tags: ["stories"],
    summary: "Delete story",
    params: idParam,
    response: {
      204: {
        type: "null",
        description: "Story deleted",
      },
      404: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },
};
