import { Out } from "@/app.types";
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(256).describe("title"),
  content: z.string().min(1),
});

export const updatePostSchema = createPostSchema.partial();

export const postIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreatePostBody = Out<typeof createPostSchema>;
export type UpdatePostBody = Out<typeof updatePostSchema>;
export type PostIdParam = Out<typeof postIdParamSchema>;
