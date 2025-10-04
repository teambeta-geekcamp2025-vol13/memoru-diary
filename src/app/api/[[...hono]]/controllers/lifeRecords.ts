import { Hono } from "hono";

import { imageToText } from "../services/lifeRecordService";

const lifeRecordsController = new Hono();

lifeRecordsController.get("/", (c) => {
  return c.text("lifeRecords");
});

lifeRecordsController.post("/image-to-text", async (c) => {
  const body = await c.req.json<{ base64ImageFile: string }>();
  const text = await imageToText(body.base64ImageFile);
  return c.json({ text });
});

export default lifeRecordsController;
