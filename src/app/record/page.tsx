"use client"
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";

export default function record() {
      const [image, setImage] = useState('')
    


     return (
      <form>
       <div className={styles.page}>
        <h1 className={styles.title}>プレビュー</h1>
        <Link href="/">
          <button className={styles.btn} type="button">
            キャンセル
          </button>
        </Link>
        <div className={styles.btn_group}>
          <button id="photo" className={styles.btn} type="button">
            再撮影
          </button>
          <button id="photo" className={styles.btn} type="button">
            選び直し
          </button>
        </div>

        <Image
          className={styles.image}
          src="/sample.jpg"
          alt="preview"
          height={500}
          width={300}
        />
        <input className={styles.textarea} id="essay" type="text"/>
        <button  className={styles.sendBtn} type="submit">
          送信
        </button>
        
      </div>
    </form>
  );
}
