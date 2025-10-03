import { handle } from "hono/vercel";
import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => c.json({ message: "Hello from Hono" }));

export const GET = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);
