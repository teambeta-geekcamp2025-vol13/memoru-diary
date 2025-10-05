import { Hono } from "hono";
import { z } from "zod";
import {
  appendImageLogForToday,
  appendTextLogForToday,
} from "../services/lifeRecordService";

const lifeRecordsController = new Hono();

// GET / — APIの使い方
lifeRecordsController.get("/", (c) => {
  const html = `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>Life Records API</title>
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
    <h1>👋 Life Records API</h1>
    <p>利用可能なエンドポイント一覧（リクエスト例・レスポンス例付き）</p>

    <h2><span class="method">POST</span> /image-to-text</h2>
    <p>画像（base64）をAIで解析してテキスト化＆保存</p>
    <p><b>Request:</b></p>
    <pre>{
  "userId": "string (UUID)",
  "base64ImageFile": "string (base64)"
}</pre>
    <p><b>Response:</b></p>
    <pre>{
  "to_text": "AIが抽出したテキスト"
}</pre>

    <h2><span class="method">POST</span> /texts</h2>
    <p>手入力のテキストを保存</p>
    <p><b>Request:</b></p>
    <pre>{
  "userId": "string (UUID)",
  "text": "string"
}</pre>
    <p><b>Response:</b></p>
    <pre>{
  "message": "text saved",
  "data": {
    "life_record_id": "uuid",
    "text": "入力内容"
  }
}</pre>

    <hr />
    <small>© ${new Date().getFullYear()} Life Records API</small>
  </body>
  </html>
  `;
  return c.html(html);
});

lifeRecordsController.post("/image-to-text", async (c) => {
  const schema = z.object({
    userId: z.string().uuid(),
    base64ImageFile: z.string(),
  });
  const body = await c.req.json();
  const parsed = schema.parse(body);
  const { userId, base64ImageFile } = parsed;

  try {
    const result = await appendImageLogForToday(userId, base64ImageFile);
    return c.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "今日のライフレコードが見つかりません。") {
        return c.json({ error: error.message }, 404);
      }
      if (error.message === "AI変換に失敗しました。") {
        return c.json({ error: error.message }, 500);
      }
    }
    throw error;
  }
});

lifeRecordsController.post("/texts", async (c) => {
  const schema = z.object({
    userId: z.string().uuid(),
    text: z.string(),
  });
  const body = await c.req.json();
  const parsed = schema.parse(body);
  const { userId, text } = parsed;
  try {
    const data = await appendTextLogForToday(userId, text);
    return c.json({ message: "text saved", data });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "今日のライフレコードが見つかりません。") {
        return c.json({ error: error.message }, 404);
      }
    }
    throw error;
  }
});

export default lifeRecordsController;
