"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function DiaryPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>日記ページ</h1>
      <Link href="/diary/list">日記一覧へ &gt;</Link>
    </div>
  );
}
