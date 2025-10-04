"use client"
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";


export default function DiariesList() {
   interface diary_json {
      [diary_name:string]:{ time:string,
                   title:string}}
  const [diary,Setdiary] = useState<diary_json>({
    diary_01: {
      time: "2025.09.30",
      title: "競技プログラミングの勉強をした",
    },
    diary_02: {
      time: "2025.09.30",
      title: "競技プログラミングの勉強をした",
    },
    diary_03: {
      time: "2025.09.29",
      title: "今日は紅葉を見に行ったよ",
    },
    diary_04: {
      time: "2025.09.28",
      title: "買い物で失敗した",
    },



});

  return (
    <div>
      
      <div className={styles.top_box}>
        <h2 className={styles.h2}> 日記一覧</h2>
        <ul >
         <li className={styles.top_li}>リスト</li>
         <li className={styles.top_li}>カレンダー</li>
         <li className={styles.top_li}>検索</li>
         </ul>
      </div>
      <div className={styles.box}>
        <Link href="/diary">
        {Object.entries(diary).map(([key, value]) => (
        <ul>
          <li className={styles.diary_li}>
            <p key={key}>
            <p>{value.time}</p> 
            <h2>{value.title}</h2>
            </p>
          </li>
        </ul>
             ))}

        </Link>
    </div>
    

    </div>
  );
};
