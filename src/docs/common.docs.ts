import { FastifySchema } from "fastify";

interface WrapperOption {
  isArray?: boolean;
}

export const wrapper = (data: unknown, option?: WrapperOption) => {
  return {
    type: "object",
    required: ["success", "message", "data"],
    additionalProperties: false,
    properties: {
      success: { type: "boolean" },
      message: { type: "string" },
      data: option?.isArray
        ? {
            type: "array",
            items: data,
          }
        : data,
    },
  } as const;
};

export type DocsOf<T> = Record<keyof T, FastifySchema>;
