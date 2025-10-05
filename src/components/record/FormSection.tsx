"use client";

import { Icon } from "@iconify/react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useImageStore } from "@/store/imageStore";
import Popup from "../popup/Popup";
import styles from "./FormSection.module.css";
import { useImageToText } from "./hooks/useImageToText";
import PreviewImage from "./PreviewImage";

export default function FormSection() {
  const [isOpen, setIsOpen] = useState(false);
  const setImage = useImageStore((state) => state.setImage);
  const file = useImageStore((state) => state.file);
  const [text, setText] = useState("");
  const [uniquePlaceholder, setUniquePlaceholder] = useState("");
  const {
    aiText,
    errorMessage,
    isLoading,
    submit,
    reset: resetResult,
    setErrorMessage: setSubmissionError,
  } = useImageToText();

  const placeholderList = [
    "いま、なにしている？",
    "今日の気分は？",
    "それでは一言どうぞ！",
    "小さな思い出も塵積もだ！",
    "ふむふむ、なになに？",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * placeholderList.length);
    setUniquePlaceholder(placeholderList[randomIndex]);
  }, []);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setIsOpen(true);
      resetResult();
      console.log("選択された画像ファイル: ", selectedFile);
    } else {
      setSubmissionError(
        "画像のアップロードに失敗しました。もう一度お試しください。",
      );
    }
  }

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    console.log("一言メモ: ", e.target.value);
  }

  function handleClosePopup() {
    setIsOpen(false);
  }

  function handleClearPreview() {
    resetResult();
    setIsOpen(false);
  }

  async function submitImageRequest() {
    if (!file) {
      setSubmissionError("まずは画像を選択してください。");
      return;
    }

    await submit(file);
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submitImageRequest();
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>あなたはいま、何してる？</h2>
      {/* フォームセクション */}
      <form className={styles.form} onSubmit={handleFormSubmit}>
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
              onChange={handleImageChange}
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
          <input
            className={styles.input_text}
            type="text"
            value={text}
            // お楽しみ要素
            placeholder={uniquePlaceholder}
            onChange={handleTextChange}
          />
          <button className={styles.submit_button} type="submit">
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
      <Popup isOpen={isOpen} setClose={handleClosePopup}>
        <PreviewImage onClearImage={handleClearPreview} />
        <div className={styles.popup_footer}>
          <button
            className={styles.popup_submit_button}
            type="button"
            onClick={() => void submitImageRequest()}
            disabled={isLoading}
          >
            {isLoading ? "送信中…" : "送信！"}
          </button>
          <p className={styles.status_message} aria-live="polite">
            {isLoading ? "画像を解析しています…" : ""}
          </p>
          {errorMessage && (
            <p className={styles.error_message} role="alert">
              {errorMessage}
            </p>
          )}
          {aiText && (
            <div className={styles.ai_text_container}>
              <h3 className={styles.ai_text_title}>AIからのメモ</h3>
              <p className={styles.ai_text_body}>{aiText}</p>
            </div>
          )}
        </div>
      </Popup>
      {aiText && (
        <section className={styles.result_section} aria-live="polite">
          <h3 className={styles.result_title}>最新のAIメモ</h3>
          <p className={styles.result_text}>{aiText}</p>
        </section>
      )}
      {!isOpen && errorMessage && (
        <p className={styles.error_message} role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  );
}
