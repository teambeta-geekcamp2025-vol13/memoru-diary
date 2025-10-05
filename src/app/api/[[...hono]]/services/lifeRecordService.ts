import gemini from "../integrations/gemini";

export async function imageToText(base64ImageFile: string) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "この画像の状況を箇条書きで5つ挙げてください" },
  ];
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
  });

  return response.text;
}
