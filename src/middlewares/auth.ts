import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { prisma } from "../libs/prisma-client";

export const checkAuthorized = createMiddleware(async (c, next) => {
  try {
    // get authorization header
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ message: "Authorization header is required" }, 401);
    }

    // split token from authorizarion header
    const token = authHeader.split(" ")[0];
    if (!token) {
      return c.json({ message: "Token is requred" }, 401);
    }

    // decode token
    const payload = await verify(token, String(process.env.JWT_SECRET_KEY));
    if (!payload) {
      return c.json({ message: "Invalid token" }, 401);
    }

    console.log(payload);

    // check user
    const user = await prisma.user.findUnique({
      where: {
        id: "",
      },
    });

    c.set("token", token);

    await next();
  } catch (error) {
    return c.json({ message: error }, 400);
  }
});
