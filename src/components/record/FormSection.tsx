"use client";

import { Icon } from "@iconify/react";
import type React from "react";
import { useState } from "react";
import { useImageStore } from "@/store/imageStore";
import Popup from "../popup/Popup";
import styles from "./FormSection.module.css";
import PreviewImage from "./PreviewImage";

export default function FormSection() {
  const [isOpen, setIsOpen] = useState(false);

  const setImage = useImageStore((state) => state.setImage);
  const [text, setText] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setIsOpen(true);
      console.log("選択された画像ファイル: ", selectedFile);
    } else {
      alert("画像のアップロードに失敗しました！もう一度お試しください。");
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    console.log("一言メモ: ", e.target.value);
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>あなたはいま、何してる？</h2>
      {/* フォームセクション */}
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
              onChange={() => handleImageChange}
            />
            <label className={styles.label} htmlFor="launch_camera">
              <Icon
                className={styles.icon}
                icon="ph:camera-plus-duotone"
                width="60"
                height="60"
              />
              <p className={styles.text}>写真を撮る</p>
            </label>
          </div>
          {/* フォルダから選択 */}
          <div className={styles.wrapper}>
            <input
              hidden
              id="select_from_folder"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label className={styles.label} htmlFor="select_from_folder">
              <Icon
                className={styles.icon}
                icon="ph:image-duotone"
                width="60"
                height="60"
              />
              <p className={styles.text}>画像を選ぶ</p>
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
      {/* プレビューセクション */}
      <Popup isOpen={isOpen} setClose={() => setIsOpen(false)}>
        <PreviewImage onClearImage={() => setIsOpen(false)} />
        {/* TODO: 画像を送信するボタン等々 */}
      </Popup>
    </section>
  );
}
