import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

export const app = new Hono().basePath("/api");

import lifeRecordsController from "./controllers/lifeRecords";

app.use(
  "*",
  logger((str, ...rest) => {
    console.log(`[🔥Hono] ${str}`, ...rest);
  }),
);
app.use("*", cors());

app.route("/lifeRecords", lifeRecordsController);
