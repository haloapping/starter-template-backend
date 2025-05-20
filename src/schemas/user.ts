import { z } from "zod";
import { BaseCommentSchema, BasePostSchema, BaseUserSchema } from "./base";

export const UserSchema = BaseUserSchema.extend({
  posts: z.array(BasePostSchema),
}).strict();

export const RegisterUserSchema = BaseUserSchema.pick({
  username: true,
  email: true,
  password: true,
})
  .extend({
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 carachter" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/\d/, {
        message: "Password must contain at least one number",
      })
      .regex(/\W/, {
        message: "Password must contain at least one special character",
      })
      .refine((val) => !/\s/.test(val), {
        message: "Password must not contain spaces",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginUserSchema = BaseUserSchema.pick({
  username: true,
  password: true,
}).strict();

export const UpdateUserSchema = LoginUserSchema.partial().strict();
