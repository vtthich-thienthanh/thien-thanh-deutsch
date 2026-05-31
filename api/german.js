export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    const prompt = `
Từ/cụm từ tiếng Việt: "${text}"

Hãy trả về JSON theo mẫu:

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

Yêu cầu:
- deRead = cách đọc kiểu tiếng Việt
- deExampleRead = cách đọc kiểu tiếng Việt
- enRead = cách đọc tiếng Việt
- Ví dụ ngắn gọn dễ dùng trong công việc và cuộc sống
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    const content = data.choices[0].message.content;

    res.status(200).json(JSON.parse(content));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}