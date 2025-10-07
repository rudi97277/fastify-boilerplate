import { z } from "zod";

export const postIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createPostSchema = z.object({
  title: z.string().min(1).max(256),
  content: z.string().min(1),
});

export const updatePostSchema = createPostSchema.partial();

export type PostIdParams = z.infer<typeof postIdParamSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
