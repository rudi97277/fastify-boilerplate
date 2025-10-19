import { FastifySchema } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";

interface WrapperOption {
  success?: boolean;
  message?: string;
}

export enum TAGS {
  POST,
}

export const wrap = <T extends z.ZodType>(data: T, option?: WrapperOption) => {
  return z.object({
    success: z.boolean().default(option?.success ?? true),
    request_id: z.string().default(randomUUID()),
    message: z
      .string()
      .default(option?.success ?? true ? "Request success" : "Request failed"),
    data: option?.success ?? true ? data : z.null(),
  });
};

export type DocsOf<T> = Record<keyof T, FastifySchema>;

export const makeDocs =
  <T>(tag: string) =>
  (
    schemas: Record<keyof T, Omit<FastifySchema, "tags">>
  ): Record<keyof T, FastifySchema> => {
    const out = {} as Record<keyof T, FastifySchema>;
    for (const k of Object.keys(schemas) as Array<keyof T>) {
      const v = schemas[k];
      out[k] = { ...v, tags: [tag] };
    }
    return out;
  };
