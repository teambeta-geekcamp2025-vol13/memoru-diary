"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import styles from "./FormSection.module.css";

export default function FormSection() {
  // TODO: 次のページでも状態を使用するのでグローバルステート用のライブラリに移行する
  const [text, setText] = useState("");

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    console.log("一言メモ: ", e.target.value);
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>あなたはいま、何してる？</h2>
      <form className={styles.form} action="">
        {/* 画像エリア */}
        <div className={styles.input_image_area}>
          {/* カメラで撮影 */}
          <div className={styles.wrapper}>
            <input
              hidden
              type="file"
              capture="environment"
              accept="image/*"
              id="launch_camera"
            />
            <label className={styles.label} htmlFor="launch_camera">
              <Icon
                className={styles.icon}
                icon="ph:camera-plus-duotone"
                width="24"
                height="24"
              />
              <p>写真を撮る</p>
            </label>
          </div>
          {/* フォルダから選択 */}
          <div className={styles.wrapper}>
            <input
              hidden
              id="select_from_folder"
              type="file"
              accept="image/*"
            />
            <label className={styles.label} htmlFor="select_from_folder">
              <Icon
                className={styles.icon}
                icon="ph:image-duotone"
                width="24"
                height="24"
              />
              <p>画像を選ぶ</p>
            </label>
          </div>
        </div>
        {/* テキストエリア */}
        <div className={styles.input_text_area}>
          <input type="text" value={text} onChange={handleTextChange} />
          <button type="submit">
            <Icon
              className={styles.icon}
              icon="ph:paper-plane-tilt-duotone"
              width="24"
              height="24"
            />
          </button>
        </div>
      </form>
    </section>
  );
}
