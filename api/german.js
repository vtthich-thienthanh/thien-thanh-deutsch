export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { text } = req.body;

    const prompt = `
Người dùng nhập tiếng Việt: "${text}"

Hãy trả về JSON theo format:

{
  "vi": "...",
  "de": "...",
  "deType": "...",
  "deRead": "...",
  "deExample": "...",
  "deExampleRead": "...",
  "viMeaning": "...",
  "en": "...",
  "enType": "...",
  "enRead": "...",
  "enExample": "..."
}

Yêu cầu:
- Tiếng Đức tự nhiên
- Có phiên âm kiểu tiếng Việt dễ đọc
- Có ví dụ thực tế
- Có tiếng Anh tương ứng
- Chỉ trả JSON
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    const content = data.choices[0].message.content;

    const parsed = JSON.parse(content);

    res.status(200).json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "AI error",
      detail: err.message,
    });
  }
}