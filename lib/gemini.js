import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY =
  process.env.EXPO_PUBLIC_GEMINI_KEY;

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export const PROMPTS = {
  academic: `
Act as a university professor.

Analyze this image and identify:

- Objects
- Educational context
- Activities
- One constructive recommendation

Return ONLY valid JSON.

{
  "objects":["item1","item2"],
  "context":"Describe the setting",
  "activities":"Describe visible activity",
  "recommendations":"Give one recommendation"
}

Never omit fields.
`,

  safety: `
Act as a workplace safety inspector.

Analyze this image and identify:

- Objects
- Safety hazards (or state none exist)
- Activities
- One safety recommendation

Return ONLY valid JSON.

{
  "objects":["item1","item2"],
  "context":"Describe hazards or safety context",
  "activities":"Describe activity",
  "recommendations":"Give one recommendation"
}

Never omit fields.
`,

  inventory: `
Act as an asset management clerk.

Analyze this image and identify:

- Visible physical assets
- Context
- Activities
- One inventory recommendation

Return ONLY valid JSON.

{
  "objects":["item1","item2"],
  "context":"Describe location",
  "activities":"Describe activity",
  "recommendations":"Give one recommendation"
}

Never omit fields.
`
};

export async function imageToBase64(uri) {
  try {

    const base64 =
      await FileSystem.readAsStringAsync(
        uri,
        {
          encoding:
            FileSystem.EncodingType.Base64,
        }
      );

    console.log(
      "Base64 Length:",
      base64.length
    );

    return base64;

  } catch (error) {

    console.log(
      "Base64 Error:",
      error
    );

    throw error;
  }
}

export async function analyzeImage(
  base64Image,
  prompt = PROMPTS.academic
) {
  try {

    const response =
      await fetch(
        GEMINI_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  },
                  {
                    inline_data: {
                      mime_type:
                        "image/jpeg",

                      data:
                        base64Image
                    }
                  }
                ]
              }
            ]
          })
        }
      );

    const json =
      await response.json();

    console.log(
      "HTTP:",
      response.status
    );

    console.log(
      "Gemini JSON:",
      JSON.stringify(
        json,
        null,
        2
      )
    );

    if (!response.ok) {
      throw new Error(
        json?.error?.message ||
        "Gemini API failed"
      );
    }

    return json;

  } catch (error) {

    console.log(
      "Gemini Error:",
      error
    );

    throw error;
  }
}

export { GEMINI_KEY };