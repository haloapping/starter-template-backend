import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { prisma } from "../libs/prisma-client";
import {
  CommentSchema,
  CreateCommentSchema,
  UpdateCommentSchema,
} from "../schemas/comment";

export const commentRoutes = new OpenAPIHono();

commentRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Comment"],
    summary: "Get all comments",
    description: "Get all comments",
    responses: {
      200: {
        description: "Get all comments",
        content: {
          "application/json": {
            schema: z.array(CommentSchema.omit({ post: true })),
          },
        },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const comments = await prisma.comment.findMany();

      return c.json(comments, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

commentRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:id",
    tags: ["Comment"],
    summary: "Get comment by id",
    description: "Get comment by id",
    request: { params: z.object({ id: z.string().ulid() }) },
    responses: {
      200: {
        description: "Get comment by id",
        content: { "application/json": { schema: CommentSchema } },
      },
      400: {
        description: "Bad request",
      },
      404: {
        description: "Comment not found",
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const comment = await prisma.comment.findUnique({
        where: {
          id: id,
        },
        include: {
          post: true,
        },
      });

      if (!comment) {
        return c.json({ message: "Comment not found" }, 404);
      }

      return c.json(comment, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

commentRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Comment"],
    summary: "Add new comment",
    description: "Add new comment",
    request: {
      body: {
        content: {
          "application/json": { schema: CreateCommentSchema },
        },
      },
    },
    responses: {
      201: {
        description: "Add new comment",
        content: {
          "application/json": { schema: CommentSchema.omit({ post: true }) },
        },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const comment = await prisma.comment.create({
        data: body,
      });

      return c.json(comment, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

commentRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    tags: ["Comment"],
    summary: "Edit comment by id",
    description: "Edit comment by id",
    request: {
      params: z.object({ id: z.string().ulid() }),
      body: {
        content: {
          "application/json": {
            schema: UpdateCommentSchema.omit({ userId: true }),
          },
        },
      },
    },
    responses: {
      201: {
        description: "Edit comment by id",
        content: {
          "application/json": {
            schema: CommentSchema.omit({ post: true }),
          },
        },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const comment = await prisma.comment.update({
        where: {
          id: id,
        },
        data: body,
      });

      return c.json(comment, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

commentRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    tags: ["Comment"],
    summary: "Delete comment by id",
    description: "Delete comment by id",
    request: {
      params: z.object({ id: z.string().ulid() }),
    },
    responses: {
      200: {
        description: "Delete comment by id",
        content: {
          "application/json": { schema: CommentSchema.omit({ post: true }) },
        },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const comment = await prisma.comment.delete({
        where: {
          id: id,
        },
      });

      return c.json(comment, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);
