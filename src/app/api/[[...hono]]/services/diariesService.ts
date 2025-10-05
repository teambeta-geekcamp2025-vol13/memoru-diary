import gemini from "../integrations/gemini";
import {
  findLifeRecordByUserAndDate,
  findLifeRecordWithLogs,
} from "../repositories/lifeRecordsRepo";
import {
  findDiariesByUserId,
  findDiaryByLifeRecordId,
  insertDiary,
} from "../repositories/diariesRepo";
import { getLifeRecordWithLogs, getTodayLifeRecord } from "./lifeRecordService";

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

export async function createDiary(userId: string) {
  const lifeRecord = await getTodayLifeRecord(userId);
  if (!lifeRecord) {
    throw new Error("今日のライフレコードが見つかりません。");
  }

  const existingDiary = await findDiaryByLifeRecordId(lifeRecord.id);
  if (existingDiary) {
    throw new Error("今日の日記は既に作成されています。");
  }

  const lifeRecordWithLogs = await getLifeRecordWithLogs(lifeRecord.id);

  const textLogs = (lifeRecordWithLogs?.texts ?? [])
    .map((log) => log.text.trim())
    .filter((value) => value.length > 0);

  const imageLogs = (lifeRecordWithLogs?.images ?? [])
    .map((log) => (log.to_text ?? log.description ?? "").trim())
    .filter((value) => value.length > 0);

  const logs = [...textLogs, ...imageLogs];
  if (logs.length === 0) {
    throw new Error(
      "日記を生成するためのログが保存されていません。ログを記録してから再度お試しください。",
    );
  }

  const prompt = [
    "あなたは一人称で丁寧な日本語の日記を作成するアシスタントです。",
    "以下のログを読み、本日の出来事を3〜5段落程度でまとめてください。",
    '出力は必ず次のJSON形式にしてください: {"title": string, "text": string}。',
    "titleは20文字以内で端的に出来事を表現し、textは読みやすい改行を含む本文にしてください。",
    "活動ログ:",
    logs.map((log, index) => `${index + 1}. ${log}`).join("\n"),
  ].join("\n");

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ text: prompt }],
    config: {
      responseMimeType: "application/json",
    },
  });

  const raw = typeof response.text === "string" ? response.text.trim() : "";
  if (!raw) {
    throw new Error("AIからのレスポンスが空でした。");
  }

  const diaryPayload = parseDiaryJson(raw);

  const diary = await insertDiary({
    userId,
    lifeRecordId: lifeRecord.id,
    title: diaryPayload.title,
    text: diaryPayload.text,
  });

  return diary;
}

function parseDiaryJson(raw: string): { title: string; text: string } {
  let candidate = raw;

  if (!candidate.startsWith("{")) {
    const match = candidate.match(/\{[\s\S]*\}/);
    if (match) {
      candidate = match[0];
    }
  }

  try {
    const parsed = JSON.parse(candidate);
    const title = typeof parsed.title === "string" ? parsed.title.trim() : "";
    const text = typeof parsed.text === "string" ? parsed.text.trim() : "";

    if (!title || !text) {
      throw new Error("title/text missing");
    }

    return { title, text };
  } catch (_error) {
    throw new Error("AIレスポンスの解析に失敗しました。");
  }
}
