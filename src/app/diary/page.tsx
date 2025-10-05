"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function DiariesList() {
  interface diary_json {
    [diary_name: string]: { date: string; title: string };
  }
  const [diary, Setdiary] = useState<diary_json>({
    diary_01: {
      date: "2025.09.30",
      title: "競技プログラミングの勉強をした",
    },
    diary_02: {
      date: "2025.09.30",
      title: "競技プログラミングの勉強をした",
    },
    diary_03: {
      date: "2025.09.29",
      title: "今日は紅葉を見に行ったよ",
    },
    diary_04: {
      date: "2025.09.28",
      title: "買い物で失敗した",
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.top_box}>
        <h2 className={styles.h2}>日記一覧</h2>
        <ul>
          <li className={styles.top_li}>リスト</li>
          <li className={styles.top_li}>カレンダー</li>
          <li className={styles.top_li}>検索</li>
        </ul>
      </div>
      <div className={styles.box}>
        {Object.entries(diary).map(([key, value]) => (
          <ul key={key}>
            <li className={styles.diary_li}>
              <Link href={`/diary/${encodeURIComponent(value.date)}`}>
                <p className={styles.p}>{value.date}</p>
                <h2 className={styles.sentence}>{value.title}</h2>
              </Link>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}
