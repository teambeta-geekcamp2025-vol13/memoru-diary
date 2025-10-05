"use client"
import styles from "./page.module.css";
import { useState ,useContext,createContext, useEffect} from "react";

export default function DiariesList() {
   type diary_json ={
  "diaries": [
    {
      "id": string,
      "title": string,
      "created_at": string
    }
  ]
}

 
    
  const USER_ID = "teamBeta"
  const [diary,Setdiary] = useState({
   diaries:[{
      id :"1",
      title: "競技プログラミングの勉強をした",
      created_at: "2025.09.30"}]});

    const FetchData = async () => {
    try {
      const response = await fetch('https://memoru-diary.vercel.app/api/'+USER_ID);
      const data = response.json
      Setdiary(data)
      return diary
    } catch (error) {
      console.error('データ取得エラー:', error);}}
    useEffect(FetchData(),[])
    

    
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
            <Link href={'/diary/'+encodeURIComponent(value.created_at)}>
             <p>{value.created_at}</p> 
             <h2>{value.title}</h2>
             
            </Link>
          </li>
         </ul>
        
             ))}

     
      </div>
     </div>
  );
};
