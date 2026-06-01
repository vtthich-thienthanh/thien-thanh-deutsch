import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { text } = req.body;
    const word = text;

    if (!word) {
      return res.status(400).json({
        error: "Thiếu từ cần dịch",
      });
    }

    const prompt = `
Bạn là giáo viên tiếng Đức.

Từ tiếng Việt: "${word}"

Hãy trả về JSON đúng format:

{
  "de": "",
  "deRead": "",
  "deType": "",
  "deExample": "",
  "deExampleRead": "",
  "viMeaning": "",
  "en": "",
  "enRead": "",
  "enType": ""
}

Chỉ trả JSON.
`;

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const textResult = chat.choices[0].message.content;

    const data = JSON.parse(textResult);

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}