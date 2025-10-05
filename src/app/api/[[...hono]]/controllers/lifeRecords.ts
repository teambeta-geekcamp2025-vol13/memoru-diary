import { Hono } from "hono";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { imageToText } from "../services/lifeRecordService";
import db from "../integrations/drizzle";
import { life_records, record_images, record_texts } from "../db/schema";

const lifeRecordsController = new Hono();

lifeRecordsController.post("/image-to-text", async (c) => {
  const body = await c.req.json<{ base64ImageFile: string }>();
  const text = await imageToText(body.base64ImageFile);
  return c.json({ text });
});

lifeRecordsController.post("/images", async (c) => {
  const schema = z.object({
    userId: z.string().uuid(),
    to_text: z.string(),
  });
  const body = await c.req.json();
  const parsed = schema.parse(body);
  const { userId, to_text } = parsed;

  const recordId = await getTodayLifeRecordId(userId);

  if (!recordId) {
    return c.json({ error: "Life record not found for today." }, 404);
  }

  await db.insert(record_images).values({
    life_record_id: recordId,
    to_text,
  });
  return c.json({ message: "Image saved", lifeRecordId: recordId });
});

lifeRecordsController.post("/texts", async (c) => {
  const schema = z.object({
    userId: z.string().uuid(),
    text: z.string(),
  });
  const body = await c.req.json();
  const parsed = schema.parse(body);
  const { userId, text } = parsed;

  const recordId = await getTodayLifeRecordId(userId);

  if (!recordId)
    return c.json({ error: "Life record not found for today" }, 404);

  await db.insert(record_texts).values({
    life_record_id: recordId,
    text,
  });
  return c.json({ message: "text saved", lifeRecordId: recordId });
});

lifeRecordsController.get("/:recordId", async (c) => {
  const recordId = c.req.param("recordId");
  const data = await getLifeRecordWithLogs(recordId);

  if (!data) {
    return c.json({ error: "Life record not found" }, 404);
  }

  return c.json(data);
});

async function getTodayLifeRecordId(userId: string) {
  const today = new Date().toISOString().split("T")[0];
  const record = await db.query.life_records.findFirst({
    where: and(
      eq(life_records.user_id, userId),
      eq(life_records.record_date, today),
    ),
  });
  if (!record) return null;

  return record.id;
}

export async function getLifeRecordWithLogs(recordId: string) {
  const record = await db.query.life_records.findFirst({
    where: eq(life_records.id, recordId),
  });

  if (!record) return null;

  const [texts, images] = await Promise.all([
    db
      .select()
      .from(record_texts)
      .where(eq(record_texts.life_record_id, recordId)),
    db
      .select()
      .from(record_images)
      .where(eq(record_images.life_record_id, recordId)),
  ]);

  return {
    record,
    texts,
    images,
  };
}

export default lifeRecordsController;
