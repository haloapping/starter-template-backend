import { z } from "zod";
import { BaseCommentSchema, BasePostSchema, BaseUserSchema } from "./base";

export const PostSchema = BasePostSchema.extend({
  user: BaseUserSchema,
  comments: z.array(BaseCommentSchema),
});

export const CreatePostSchema = BasePostSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).strict();

export const UpdatePostSchema = CreatePostSchema.partial().strict();
