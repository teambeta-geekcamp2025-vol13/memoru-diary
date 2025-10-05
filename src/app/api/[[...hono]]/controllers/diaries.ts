import { Hono } from "hono";

const diariesController = new Hono();

diariesController.get("/", (c) => {
  return c.text("diaries");
});

export default diariesController;
