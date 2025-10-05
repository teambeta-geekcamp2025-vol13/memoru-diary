import { create } from "zustand";

type ImageState = {
  file: File | null;
  imageUrl: string | null;
  setImage: (newFile: File | null) => void;
};

export const useImageStore = create<ImageState>((set, get) => ({
  file: null,
  imageUrl: null,
  setImage: (newFile) => {
    // 1. 以前の画像のプレビューURLをメモリから解放する（メモリリーク防止のため）
    const { imageUrl } = get();
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    // 2. 新しいファイルがnullでなければ、プレビュー用のURLを生成する
    if (newFile) {
      const newImageUrl = URL.createObjectURL(newFile);
      set({ file: newFile, imageUrl: newImageUrl });
    } else {
      // 3. ファイルがnullなら（クリア処理など）、stateをリセットする
      set({ file: null, imageUrl: null });
    }
  },
}));
