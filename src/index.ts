import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { configDocs, configGeneral } from "./configs/app";
import { commentRoutes } from "./routes/comment";
import { postRoutes } from "./routes/post";
import { userRoutes } from "./routes/user";

const app = new OpenAPIHono();

// configs
app
  .doc(configDocs.openapi, {
    openapi: "3.1.0",
    info: { ...configGeneral, version: "v1" },
  })
  .get(
    "/",
    Scalar({
      pageTitle: "Starter Template Backend API",
      url: "/openapi.json",
      theme: "default",
    }),
  );

// middlewares
app.use(cors());
app.use(logger());

// routes
app.basePath("/");
app.route("/users", userRoutes);
app.route("/comments", postRoutes);
app.route("/posts", commentRoutes);

export default app;
