import { and, eq } from "drizzle-orm";

import { life_records, record_images, record_texts } from "../db/schema";
import db from "../integrations/drizzle";

export async function findLifeRecordByUserAndDate(
  userId: string,
  recordDate: string,
) {
  return db.query.life_records.findFirst({
    where: and(
      eq(life_records.user_id, userId),
      eq(life_records.record_date, recordDate),
    ),
  });
}

export async function insertLifeRecordImage(lifeRecordId: string, toText: string) {
  await db.insert(record_images).values({
    life_record_id: lifeRecordId,
    to_text: toText,
  });
}

export async function insertLifeRecordText(lifeRecordId: string, text: string) {
  await db.insert(record_texts).values({
    life_record_id: lifeRecordId,
    text,
  });
}

export async function findLifeRecordWithLogs(recordId: string) {
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
