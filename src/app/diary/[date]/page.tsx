"use client";

import { use } from "react";
import styles from "./page.module.css";
import { useState ,useContext,createContext, useEffect} from "react";
type props = { params: Promise<{ date: string }> };



export default function DiaryPage({ params }: props) {
  const { date } = use(params);
  const FetchData = async () => {
    try {
      const response = await fetch('https://memoru-diary.vercel.app/api/'+USER_ID+"/"+date);
      const data = response.json
      return data
    } catch (error) {
      console.error('データ取得エラー:', error);}}
    useEffect(FetchData(),[])
  return (
    {Object.entries(diary).map(([key, value]) => (
    <div className={styles.page}>
      <h1>日記ページ</h1>
      <div className={styles.diarybody}>
        <h2 className={styles.title}>{data.diary}</h2>
        <p className={styles.date}>記録:{date}</p>
        <div className={styles.essay}>{data.recordTexts}</div>
     </div>
    </div> 
         
             ))}
  );
}
