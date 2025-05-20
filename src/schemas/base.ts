import { z } from "@hono/zod-openapi";

export const BaseUserSchema = z.object({
  id: z.string().ulid().openapi({ example: "01JVGKEZGP8T9M92RSXD60VQ0A" }),
  username: z.string().openapi({ example: "y4nt0" }),
  email: z.string().email().openapi({ example: "yanto@yanto.com" }),
  password: z
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
  createdAt: z.coerce.date().openapi({ example: "2025-05-18T02:27:12.535Z" }),
  updatedAt: z.coerce.date().openapi({ example: "2025-05-18T02:27:12.548Z" }),
});

export const BasePostSchema = z.object({
  id: z.string().ulid().openapi({ example: "01JVGKEZGP8T9M92RSXD60VQ0A" }),
  userId: z.string().ulid().openapi({ example: "01JVGKEZGP8T9M92RSXD60VQ0A" }),
  slug: z.string().url().openapi({
    example: "aku-cinta-pemerintah-x45Aj8",
  }),
  title: z.string().openapi({ example: "aku-cinta-pemerintah" }),
  createdAt: z.coerce.date().openapi({ example: "2025-05-18T02:27:12.535Z" }),
  updatedAt: z.coerce.date().openapi({ example: "2025-05-18T02:27:12.548Z" }),
});

export const BaseCommentSchema = z.object({
  id: z.string().ulid().openapi({ example: "01JVGKEZHHZF29YVCRSNFZ2XAK" }),
  userId: z
    .string()
    .nullable()
    .openapi({ example: "01JVGKEZHX6AZSJT22MMF3JRDR" }),
  text: z.string().openapi({
    example: "I needed this kind of inspiration today. Thank you!",
  }),
  createdAt: z.coerce.date().openapi({ example: "2025-05-18T02:27:12.535Z" }),
  updatedAt: z.coerce.date().openapi({ example: "2025-05-18T02:27:12.548Z" }),
});
