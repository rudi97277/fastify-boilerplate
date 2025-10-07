import z, { ZodType } from "zod";

export const toJSONSchema = (schema: ZodType) => {
  const doc = z.toJSONSchema(schema);
  delete doc.$schema;
  return doc;
};
