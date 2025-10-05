import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockedService = vi.hoisted(() => ({
  listDiariesByUser: vi.fn(),
  getDiaryByUserAndDate: vi.fn(),
}));

vi.mock("../services/diariesService", () => mockedService);

async function createApp() {
  const { default: diariesController } = await import("./diaries");
  const app = new Hono();
  app.route("/diaries", diariesController);
  return app;
}

describe("Diaries API", () => {
  const userId = "00000000-0000-0000-0000-000000000000";

  beforeEach(() => {
    mockedService.listDiariesByUser.mockReset();
    mockedService.getDiaryByUserAndDate.mockReset();
  });

  it("returns diaries saved in the database", async () => {
    const diaries = [
      {
        id: "11111111-1111-1111-1111-111111111111",
        userId,
        title: "テスト日記",
        text: "今日はテストを書いた。",
        readed: false,
        lifeRecordId: "22222222-2222-2222-2222-222222222222",
        createdAt: "2025-10-05T12:00:00.000Z",
        updatedAt: "2025-10-05T12:30:00.000Z",
        recordDate: "2025-10-05",
      },
    ];

    mockedService.listDiariesByUser.mockResolvedValue(diaries);

    const app = await createApp();
    const response = await app.request(`/diaries/${userId}`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ diaries });
    expect(mockedService.listDiariesByUser).toHaveBeenCalledWith(userId);
  });

  it("returns diary detail including related life record logs", async () => {
    const date = "2025-10-05";
    const detail = {
      diary: {
        id: "33333333-3333-3333-3333-333333333333",
        userId,
        title: "詳しい日記",
        text: "詳細な内容",
        lifeRecordId: "44444444-4444-4444-4444-444444444444",
        createdAt: "2025-10-05T08:00:00.000Z",
        updatedAt: "2025-10-05T09:00:00.000Z",
      },
      lifeRecord: {
        id: "44444444-4444-4444-4444-444444444444",
        userId,
        aiCreated: true,
        recordDate: date,
        createdAt: "2025-10-05T00:00:00.000Z",
        updatedAt: "2025-10-05T00:10:00.000Z",
      },
      recordTexts: [
        {
          id: "555",
          life_record_id: "44444444-4444-4444-4444-444444444444",
          text: "メモ1",
        },
      ],
      recordImages: [
        {
          id: "666",
          life_record_id: "44444444-4444-4444-4444-444444444444",
          to_text: "AIメモ",
        },
      ],
    };

    mockedService.getDiaryByUserAndDate.mockResolvedValue(detail);

    const app = await createApp();
    const response = await app.request(`/diaries/${userId}/${date}`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(detail);
    expect(mockedService.getDiaryByUserAndDate).toHaveBeenCalledWith(
      userId,
      date,
    );
  });
});
