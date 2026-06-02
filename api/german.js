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

    if (!text) {
      return res.status(400).json({
        error: "Thiếu dữ liệu",
      });
    }

    const prompt = `
Từ tiếng Việt: "${text}"

Hãy trả về JSON:

{
  "de": "",
  "deType": "",
  "deRead": "",
  "deExample": "",
  "deExampleRead": "",
  "meaning": "",
  "en": "",
  "enType": "",
  "enRead": "",
  "enExample": ""
}

Không giải thích thêm.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content;

    const data = JSON.parse(raw);

    return res.status(200).json(data);

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}