import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Halo-Halo 😊!");
});

export default app;
