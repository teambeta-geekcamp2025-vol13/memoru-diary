"use client"
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function DiaryPage() {
    const router = useRouter();
     

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>日記ページ</h1>
    <ul>
       <li>id:test</li>
    </ul>
    </div>
  );
}
