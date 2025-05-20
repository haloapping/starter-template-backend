import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { sign, verify } from "hono/jwt";
import { hashPassword, verifyPassword } from "../libs/password";
import { prisma } from "../libs/prisma-client";
import { checkAuthorized } from "../middlewares/auth";
import { BasePostSchema, BaseUserSchema } from "../schemas/base";
import {
  LoginUserSchema,
  RegisterUserSchema,
  UpdateUserSchema,
  UserSchema,
} from "../schemas/user";

export const userRoutes = new OpenAPIHono();

// register
userRoutes.openapi(
  createRoute({
    method: "post",
    path: "/register",
    tags: ["User"],
    summary: "Register",
    description: "Register user",
    request: {
      body: {
        content: {
          "application/json": { schema: RegisterUserSchema },
        },
      },
    },
    responses: {
      201: {
        description: "Register user",
        content: {
          "application/json": {
            schema: BaseUserSchema.omit({ password: true }),
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
      const body = c.req.valid("json");
      const newUser = await prisma.user.create({
        data: {
          username: body.username,
          email: body.email,
          password: await hashPassword(body.password),
        },
      });

      return c.json(newUser, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

// login
userRoutes.openapi(
  createRoute({
    method: "post",
    path: "/login",
    tags: ["User"],
    summary: "Login",
    description: "Login user",
    request: {
      body: {
        content: {
          "application/json": { schema: LoginUserSchema },
        },
      },
    },
    responses: {
      201: {
        description: "Login user",
        content: {
          "application/json": {
            schema: BaseUserSchema.omit({ password: true }),
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
      const body = c.req.valid("json");
      const user = await prisma.user.findUnique({
        where: {
          username: body.username,
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
        },
      });

      // check user exist or not
      if (!user) {
        return c.json({ message: "User is not registered" }, 404);
      }

      // verify password
      const isPasswordVerify = await verifyPassword(
        body.password,
        user.password,
      );
      if (!isPasswordVerify) {
        return c.json({ message: "Password invalid" }, 401);
      }

      // create jwt token
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
      };
      const jwtToken = await sign(payload, String(process.env.JWT_SECRET_KEY));

      const decodeToken = await verify(
        jwtToken,
        String(process.env.JWT_SECRET_KEY),
      );

      return c.json({ token: jwtToken }, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

// get all users
userRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["User"],
    summary: "Get all users",
    description: "Get all users",
    responses: {
      200: {
        description: "Get all users",
        content: { "application/json": { schema: z.array(BaseUserSchema) } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const users = await prisma.user.findMany();

      return c.json(users, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

// get all user posts
userRoutes.openapi(
  createRoute({
    method: "get",
    path: "/posts",
    tags: ["User"],
    middleware: checkAuthorized,
    summary: "Get all user posts",
    description: "Get all user posts",
    request: {
      headers: z.object({
        Authorization: z
          .string()
          .regex(/^Bearer .+$/)
          .openapi({
            description: "Bearer token for authentication",
            example: "Bearer ehyajshdasohdlaks.jsakdj...",
          }),
      }),
    },
    responses: {
      200: {
        description: "Get all user posts",
        content: { "application/json": { schema: BasePostSchema } },
      },
      400: {
        description: "Bad request",
      },
      404: {
        description: "User not found",
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const posts = await prisma.post.findMany({
        where: {
          userId: id,
        },
      });

      if (!posts) {
        return c.json({ message: "User not found" }, 404);
      }

      return c.json(posts, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

// edit user by id
userRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    tags: ["User"],
    summary: "Edit user by id",
    description: "Edit user by id",
    request: {
      params: z.object({ id: z.string().ulid() }),
      body: {
        content: {
          "application/json": { schema: UpdateUserSchema },
        },
      },
    },
    responses: {
      201: {
        description: "Edit user by id",
        content: {
          "application/json": { schema: UserSchema.omit({ posts: true }) },
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
      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: body,
      });

      return c.json(user, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);

// delete user by id
userRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    tags: ["User"],
    summary: "Delete user by id",
    description: "Delete user by id",
    request: {
      params: z.object({ id: z.string().ulid() }),
    },
    responses: {
      200: {
        description: "Delete user by id",
        content: {
          "application/json": { schema: UserSchema.omit({ posts: true }) },
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
      const user = await prisma.user.delete({
        where: {
          id: id,
        },
      });

      return c.json(user, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  },
);
