import { z } from "zod";

export const storyIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createStorySchema = z.object({
  title: z.string().min(1).max(256),
  body: z.string().min(1),
});

export const updateStorySchema = createStorySchema.partial();

export type StoryIdParams = z.infer<typeof storyIdParamSchema>;
export type CreateStoryInput = z.infer<typeof createStorySchema>;
export type UpdateStoryInput = z.infer<typeof updateStorySchema>;
