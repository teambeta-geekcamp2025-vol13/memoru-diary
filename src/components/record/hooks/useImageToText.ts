import { useCallback, useState } from "react";

const ENDPOINT = "/api/lifeRecords/image-to-text";
// TODO: 認証実装後に修正
const USER_ID = "af1afdf5-d994-4290-84b5-c49562d1f6aa";

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
    body: JSON.stringify({
      userId: USER_ID,
      base64ImageFile: base64Payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = (await response.json()) as {
    text?: string | null;
    to_text?: string | null;
  };

  const extractedText = result.text ?? result.to_text ?? null;
  return typeof extractedText === "string" ? extractedText.trim() : null;
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
        // Robust base64 extraction from data URL
        const match = /^data:(?:[\w/+.-]+)?;base64,([A-Za-z0-9+/=]+)$/.exec(
          dataUrl,
        );
        const base64Payload = match ? match[1] : "";

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
