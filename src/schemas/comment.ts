import { BaseCommentSchema, BasePostSchema, BaseUserSchema } from "./base";

export const CommentSchema = BaseCommentSchema.extend({
  post: BasePostSchema,
}).strict();

export const CreateCommentSchema = BaseCommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).strict();

export const UpdateCommentSchema = CreateCommentSchema.partial().strict();
