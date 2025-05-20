import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { prisma } from "../libs/prisma-client";
import {
  CreatePostSchema,
  PostSchema,
  UpdatePostSchema,
} from "../schemas/post";

export const postRoutes = new OpenAPIHono();

postRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Post"],
    summary: "Get all posts",
    description: "Get all posts",
    responses: {
      200: {
        description: "Get all posts",
        content: {
          "application/json": {
            schema: z.array(PostSchema.omit({ comments: true })),
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
      const posts = await prisma.post.findMany({ include: { comments: true } });

      return c.json(posts, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

postRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:id",
    tags: ["Post"],
    summary: "Get post by id",
    description: "Get post by id",
    request: { params: z.object({ id: z.string().ulid() }) },
    responses: {
      200: {
        description: "Get post by id",
        content: { "application/json": { schema: PostSchema } },
      },
      400: {
        description: "Bad request",
      },
      404: {
        description: "Post not found",
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const post = await prisma.post.findUnique({
        where: {
          id: id,
        },
        include: {
          comments: true,
        },
      });

      if (!post) {
        return c.json({ message: "Post not found" }, 404);
      }

      return c.json(post, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

postRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Post"],
    summary: "Add new post",
    description: "Add new post",
    request: {
      body: {
        content: {
          "application/json": { schema: CreatePostSchema },
        },
      },
    },
    responses: {
      201: {
        description: "Add new post",
        content: {
          "application/json": { schema: PostSchema.omit({ comments: true }) },
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
      const post = await prisma.post.create({
        data: body,
      });

      return c.json(post, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

postRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    tags: ["Post"],
    summary: "Edit post by id",
    description: "Edit post by id",
    request: {
      params: z.object({ id: z.string().ulid() }),
      body: {
        content: {
          "application/json": {
            schema: UpdatePostSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Edit post by id",
        content: {
          "application/json": {
            schema: PostSchema.omit({ user: true }),
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
      const post = await prisma.post.update({
        where: {
          id: id,
        },
        data: body,
      });

      return c.json(post, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

postRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    tags: ["Post"],
    summary: "Delete comment by id",
    description: "Delete comment by id",
    request: {
      params: z.object({ id: z.string().ulid() }),
    },
    responses: {
      200: {
        description: "Delete comment by id",
        content: {
          "application/json": {
            schema: PostSchema.omit({
              userId: true,
              user: true,
              comments: true,
            }),
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
      const post = await prisma.post.delete({
        where: {
          id: id,
        },
      });

      return c.json(post, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);
