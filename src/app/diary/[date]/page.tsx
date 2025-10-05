"use client"
import { use } from "react";
import styles from "./page.module.css";
import Link from "next/link";

type props ={params: Promise<{date: string}>}


export default function DiaryPage({params}: props) {
   const {date} = use(params)
  //const aync data = await try{fetch().then(}}catch(error){error:error}   
  return (
    <div className={styles.page}>
      <h1 >日記ページ</h1>
     <div className={styles.diarybody}>
      
       <h2 className={styles.title}>data.title</h2> 
       <p className={styles.date}>記録:{date}</p>
       <div className={styles.essay}>
          今日は朝から少し肌寒くて、秋の気配を感じた。
          コーヒーを淹れてベランダでゆっくり過ごしていたら、思った以上に時間が経っていて驚いた。
          午後は近所の図書館で本を読んで、帰りにパン屋でクロワッサンを買った。
          なんでもない一日だけど、こういう日がいちばん好きかもしれない。
        </div>
     </div>
     <Link href="/"><botton>戻る</botton></Link>
    </div>
  );
}
