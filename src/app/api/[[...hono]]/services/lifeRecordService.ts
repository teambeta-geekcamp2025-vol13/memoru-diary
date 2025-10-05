import gemini from "../integrations/gemini";
import {
  findLifeRecordByUserAndDate,
  findLifeRecordWithLogs as findLifeRecordWithLogsRepo,
  insertLifeRecordImage,
  insertLifeRecordText,
} from "../repositories/lifeRecordsRepo";

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

// JSTの日付文字列（YYYY-MM-DD）を返す
function toJstDateString(now = new Date()) {
  return new Date(now.getTime() + JST_OFFSET_MS).toISOString().split("T")[0];
}

// Geminiに画像→テキスト変換をリクエスト
async function requestImageToText(base64ImageFile: string) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "この画像の状況を箇条書きで5つ挙げてください" },
  ];

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return typeof response.text === "string" ? response.text : null;
}

// 今日のLifeRecordを取得
export async function getTodayLifeRecord(userId: string, now = new Date()) {
  const recordDate = toJstDateString(now);
  return findLifeRecordByUserAndDate(userId, recordDate);
}

// 今日のLifeRecordに画像ログを追加
export async function appendImageLogForToday(
  userId: string,
  base64ImageFile: string,
): Promise<{ to_text: string }> {
  const lifeRecord = await getTodayLifeRecord(userId);
  if (!lifeRecord) {
    throw new Error("今日のライフレコードが見つかりません。");
  }

  const toText = await requestImageToText(base64ImageFile);
  if (!toText) {
    throw new Error("AI変換に失敗しました。");
  }

  await insertLifeRecordImage(lifeRecord.id, toText);

  return { to_text: toText };
}

// 今日のLifeRecordにテキストログを追加
export async function appendTextLogForToday(
  userId: string,
  text: string,
): Promise<{ life_record_id: string; text: string }> {
  const lifeRecord = await getTodayLifeRecord(userId);
  if (!lifeRecord) {
    throw new Error("今日のライフレコードが見つかりません。");
  }

  await insertLifeRecordText(lifeRecord.id, text);

  return {
    life_record_id: lifeRecord.id,
    text,
  };
}

// 指定LifeRecordに関連するログを取得
export async function getLifeRecordWithLogs(recordId: string) {
  return findLifeRecordWithLogsRepo(recordId);
}
