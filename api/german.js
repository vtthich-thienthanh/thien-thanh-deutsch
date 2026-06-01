export default async function handler(req, res) {
  try {
    const { text } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Thiếu OPENAI_API_KEY trên Vercel",
      });
    }

    const prompt = `
Bạn là AI hỗ trợ học tiếng Đức.

Người dùng nhập tiếng Việt.
Trả về JSON đúng format:

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

Input:
${text}
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

    const content = data.choices?.[0]?.message?.content || "{}";

    return res.status(200).json(JSON.parse(content));
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}