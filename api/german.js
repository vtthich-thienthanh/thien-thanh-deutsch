export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { text } = req.body;

    const prompt = `
Người dùng nhập: "${text}"

Trả về JSON hợp lệ.

Không markdown.
Không giải thích.
Không thêm chữ ngoài JSON.

Format:

{
  "vi": "",
  "de": "",
  "deType": "",
  "deRead": "",
  "deExample": "",
  "deExampleRead": "",
  "viMeaning": "",
  "en": "",
  "enType": "",
  "enRead": "",
  "enExample": ""
}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    const data = await response.json();

    let content = data.choices[0].message.content;

    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(content);

    return res.status(200).json(parsed);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "AI failed",
      detail: error.message,
    });
  }
}