import { findLifeRecordByUserAndDate, findLifeRecordWithLogs } from "../repositories/lifeRecordsRepo";
import {
  findDiariesByUserId,
  findDiaryByLifeRecordId,
} from "../repositories/diariesRepo";

export async function listDiariesByUser(userId: string) {
  return findDiariesByUserId(userId);
}

export async function getDiaryByUserAndDate(userId: string, date: string) {
  const lifeRecord = await findLifeRecordByUserAndDate(userId, date);
  if (!lifeRecord) {
    throw new Error("ライフレコードが見つかりません");
  }

  const diary = await findDiaryByLifeRecordId(lifeRecord.id);
  const lifeRecordWithLogs = await findLifeRecordWithLogs(lifeRecord.id);

  return {
    diary,
    lifeRecord: lifeRecordWithLogs?.record ?? lifeRecord,
    recordTexts: lifeRecordWithLogs?.texts ?? [],
    recordImages: lifeRecordWithLogs?.images ?? [],
  };
}
