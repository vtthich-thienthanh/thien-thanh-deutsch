import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Chỉ cho phép POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { text } = req.body;

    // Kiểm tra dữ liệu nhập
    if (!text || text.trim() === "") {
      return res.status(400).json({
        error: "Thiếu từ cần dịch",
      });
    }

    const prompt = `
Bạn là AI giáo viên tiếng Đức thông minh.

Nhiệm vụ:
- Người dùng nhập tiếng Việt.
- Trả kết quả JSON đúng format.
- Dịch sang tiếng Đức và tiếng Anh tự nhiên.
- Tạo ví dụ ngắn dễ học.
- Phiên âm dễ đọc cho người Việt.

QUAN TRỌNG:
- deRead chỉ được phiên âm từ tiếng Đức trong trường "de".
- enRead chỉ được phiên âm từ tiếng Anh trong trường "en".
- KHÔNG được phiên âm từ tiếng Việt người dùng nhập.
- KHÔNG được lặp lại nguyên văn tiếng Việt trong phần cách đọc.

Format JSON phải đúng:

{
  "vi": "",
  "de": "",
  "deType": "",
  "deRead": "",
  "deExample": "",
  "deExampleRead": "",
  "deMeaning": "",
  "en": "",
  "enType": "",
  "enRead": "",
  "enExample": "",
  "enExampleRead": "",
  "enMeaning": ""
}

Từ cần dịch:
"${text}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Bạn là chuyên gia tiếng Đức.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;

    // Làm sạch markdown nếu có
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Lỗi AI",
      detail: error.message,
    });
  }
}