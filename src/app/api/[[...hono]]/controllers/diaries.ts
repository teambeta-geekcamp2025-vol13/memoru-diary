import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";

import {
  createDiary,
  getDiaryByUserAndDate,
  listDiariesByUser,
} from "../services/diariesService";

const diariesController = new Hono();

// GET / — APIの使い方
diariesController.get("/", (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <title>Diaries API</title>
      <style>
        body {
          font-family: sans-serif;
          padding: 2rem;
          line-height: 1.6;
          background: #fafafa;
        }
        h1 { font-size: 1.5rem; margin-bottom: 1rem; }
        h2 { margin-top: 2rem; }
        pre {
          background: #eee;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          overflow-x: auto;
        }
        code {
          background: #eee;
          padding: 2px 4px;
          border-radius: 3px;
        }
        .method { font-weight: bold; }
        small { color: #666; }
      </style>
    </head>
    <body>
      <h1>📘 Diaries API</h1>
      <p>利用可能なエンドポイント一覧（パラメータ・レスポンス例付き）</p>

      <h2><span class="method">GET</span> /:userId</h2>
      <p>指定ユーザーの全日記一覧を取得</p>
      <p><b>Path Params:</b></p>
      <pre>{
  "userId": "string (UUID)"
}</pre>
      <p><b>Response:</b></p>
      <pre>{
  "diaries": [
    {
      "id": "uuid",
      "title": "string",
      "created_at": "ISO datetime"
    }
  ]
}</pre>

      <h2><span class="method">GET</span> /:userId/:date</h2>
      <p>指定ユーザーの指定日の日記詳細とライフログを取得</p>
      <p><b>Path Params:</b></p>
      <pre>{
  "userId": "string (UUID)",
  "date": "YYYY-MM-DD"
}</pre>
      <p><b>Response:</b></p>
      <pre>{
  "diary": { ... },
  "lifeRecord": { ... },
  "recordTexts": [ ... ],
  "recordImages": [ ... ]
}</pre>

      <hr />
      <small>© ${new Date().getFullYear()} Diaries API</small>
    </body>
    </html>
  `;
  return c.html(html);
});

diariesController.post("/create", async (c) => {
  const schema = z.object({
    userId: z.string().uuid(),
  });

  const body = await c.req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        error: "リクエストボディが正しくありません",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  const { userId } = parsed.data;

  try {
    const diary = await createDiary(userId);
    return c.json({ message: "diary created", diary }, 201);
  } catch (error) {
    if (error instanceof Error) {
      const statusMap: Partial<Record<string, ContentfulStatusCode>> = {
        "今日のライフレコードが見つかりません。": 404,
        "今日の日記は既に作成されています。": 409,
        "日記を生成するためのログが保存されていません。ログを記録してから再度お試しください。": 400,
        "AIからのレスポンスが空でした。": 502,
        "AIレスポンスの解析に失敗しました。": 502,
      };
      const fallbackStatus: ContentfulStatusCode = 500;
      const status = statusMap[error.message] ?? fallbackStatus;
      return c.json({ error: error.message }, status);
    }

    console.error(error);
    return c.json({ error: "日記の作成に失敗しました" }, 500);
  }
});

diariesController.get("/:userId/:date?", async (c) => {
  const params = c.req.param();

  const baseSchema = z.object({
    userId: z.string().uuid(),
    date: z.string().optional(),
  });

  const parsed = baseSchema.safeParse(params);
  if (!parsed.success) {
    return c.json(
      {
        error: "パスパラメータが正しくありません",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  const { userId, date } = parsed.data;

  if (!date) {
    const diaryList = await listDiariesByUser(userId);
    return c.json({ diaries: diaryList });
  }

  const dateSchema = z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
    .safeParse(date);

  if (!dateSchema.success) {
    return c.json(
      {
        error: "日付の形式が不正です（YYYY-MM-DD形式で指定してください）",
      },
      400,
    );
  }

  try {
    const diaryDetail = await getDiaryByUserAndDate(userId, date);
    return c.json(diaryDetail);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ライフレコードが見つかりません"
    ) {
      return c.json({ error: "ライフレコードが見つかりません" }, 404);
    }

    console.error(error);
    return c.json({ error: "日記の取得に失敗しました" }, 500);
  }
});

export default diariesController;
