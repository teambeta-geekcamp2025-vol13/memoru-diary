"use client"
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState ,useContext,createContext} from "react";
import DiaryPage from "../diary/page";



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
    },});
    
    function Setdiary_id(id : string){  const diary_id={id: String}
                                        return diary_id
}
    
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
        
        {Object.entries(diary).map(([key, value]) => (
         <ul key={key}>
          <li className={styles.diary_li} >
            <Link href={{ pathname:"diary",query:String(Setdiary_id(value.time))}} as="diary">
    
             <p>{value.time}</p> 
             <h2>{value.title}</h2>
             
            </Link>
          </li>
         </ul>
        
             ))}

     
      </div>
     </div>
  );
};
