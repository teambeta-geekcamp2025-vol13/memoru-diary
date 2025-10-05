import { Hono } from "hono";

import { users } from "../db/schema";

const diariesController = new Hono();

diariesController.get("/", (c) => {
  return c.text("diaries");
});

export default diariesController;
