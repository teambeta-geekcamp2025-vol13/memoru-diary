"use client";

import { useImageStore } from "@/store/imageStore";
import styles from "./PreviewImage.module.css";

type Props = {
  onClearImage: () => void;
};

export default function PreviewImage({ onClearImage }: Props) {
  const imageUrl = useImageStore((state) => state.imageUrl);
  const setImage = useImageStore((state) => state.setImage);

  function handleClearImage() {
    setImage(null);
    onClearImage();
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>プレビュー</h3>
      {/* できればスクロールアイコン＆アニメーション。あるいはヒントのアイコン */}
      <p className={styles.scroll_hint}>スクロールできます</p>
      {imageUrl ? (
        <div className={styles.preview_wrapper}>
          <img className={styles.image} src={imageUrl} alt="preview" />
          <button
            className={styles.clear_button}
            type="button"
            onClick={handleClearImage}
          >
            画像をクリア
          </button>
        </div>
      ) : (
        <p>画像が選択されていません！</p>
      )}
    </div>
  );
}
