import { useCallback, useState } from "react";

const ENDPOINT = "/api/lifeRecords/image-to-text";

async function fileToBase64(imageFile: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("画像データの読み込みに失敗しました"));
      }
    };

    reader.onerror = () =>
      reject(new Error("画像データの読み込みに失敗しました"));

    reader.readAsDataURL(imageFile);
  });
}

async function requestImageToText(base64Payload: string) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ base64ImageFile: base64Payload }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = (await response.json()) as { text?: string | null };
  return result.text?.trim() ?? null;
}

export function useImageToText() {
  const [aiText, setAiText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setAiText(null);
    setErrorMessage(null);
  }, []);

  const setErrorMessageState = useCallback((message: string | null) => {
    setErrorMessage(message);
    if (message) {
      setAiText(null);
    }
  }, []);

  const submit = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setErrorMessageState(null);

      try {
        const dataUrl = await fileToBase64(file);
        const base64Payload = dataUrl.includes(",")
          ? (dataUrl.split(",")[1] ?? "")
          : dataUrl;

        if (!base64Payload) {
          throw new Error("base64Payload が空です");
        }

        const normalizedText = await requestImageToText(base64Payload);

        if (normalizedText) {
          setAiText(normalizedText);
        } else {
          setErrorMessageState("テキストの取得に失敗しました。");
        }
      } catch (error) {
        console.error("画像からテキストへの変換に失敗しました", error);
        setErrorMessageState(
          "画像の解析に失敗しました。時間を置いてもう一度お試しください。",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setErrorMessageState],
  );

  return {
    aiText,
    errorMessage,
    isLoading,
    submit,
    reset,
    setErrorMessage: setErrorMessageState,
  };
}
