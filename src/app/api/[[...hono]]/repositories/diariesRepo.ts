import { desc, eq } from "drizzle-orm";

import { diaries, life_records } from "../db/schema";
import db from "../integrations/drizzle";

export async function findDiariesByUserId(userId: string) {
  return db
    .select({
      id: diaries.id,
      userId: diaries.user_id,
      title: diaries.title,
      text: diaries.text,
      readed: diaries.readed,
      lifeRecordId: diaries.life_record_id,
      createdAt: diaries.created_at,
      updatedAt: diaries.updated_at,
      recordDate: life_records.record_date,
    })
    .from(diaries)
    .innerJoin(life_records, eq(diaries.life_record_id, life_records.id))
    .where(eq(diaries.user_id, userId))
    .orderBy(desc(life_records.record_date), desc(diaries.created_at));
}

export async function findDiaryByLifeRecordId(lifeRecordId: string) {
  return db.query.diaries.findFirst({
    where: eq(diaries.life_record_id, lifeRecordId),
  });
}
