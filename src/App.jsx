import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);

  const [result, setResult] = useState({
    de: "",
    deType: "",
    deRead: "",
    deExample: "",
    deExampleRead: "",
    meaning: "",
    en: "",
    enType: "",
    enRead: "",
    enExample: "",
  });

  // đọc giọng
  const speak = (text, lang = "de-DE") => {

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = lang;

    utterance.rate = 0.9;

    speechSynthesis.cancel();

    speechSynthesis.speak(utterance);
  };

  // gọi AI
  const handleTranslate = async (text) => {

    if (!text || text.trim() === "") return;

    try {

      setLoading(true);

      // reset dữ liệu cũ
      setResult({
        de: "",
        deType: "",
        deRead: "",
        deExample: "",
        deExampleRead: "",
        meaning: "",
        en: "",
        enType: "",
        enRead: "",
        enExample: "",
      });

      const res = await fetch("/api/german", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);

      // lưu lịch sử
      setHistory((prev) => {

        const updated = [
          text,
          ...prev.filter((item) => item !== text),
        ];

        return updated.slice(0, 20);
      });

    } catch (err) {

      console.log(err);

      setResult({
        de: "Lỗi kết nối AI",
        deType: "",
        deRead: "",
        deExample: "",
        deExampleRead: "",
        meaning: err.message,
        en: "",
        enType: "",
        enRead: "",
        enExample: "",
      });

    } finally {

      setLoading(false);

    }
  };

  // tự động tra
  useEffect(() => {

    const timer = setTimeout(() => {

      if (input.trim()) {
        handleTranslate(input);
      }

    }, 700);

    return () => clearTimeout(timer);

  }, [input]);

  return (
    <div className="app">

      <h1 className="title">
        THIEN THANH – Deutsch Schnell Lernen
      </h1>

      <p className="subtitle">
        Nhập tiếng Việt, các ô tiếng Đức – ví dụ – tiếng Anh tự hiện để học nhanh và dùng ngay.
      </p>

      <div className="input-box">

        <h2>Nhập tiếng Việt</h2>

        <input
          type="text"
          value={input}
          placeholder="Ví dụ: tình yêu, luật kinh tế..."
          onChange={(e) => setInput(e.target.value)}
        />

        <p className="note">
          Chỉ cần nhập, không cần bấm nút.
        </p>

      </div>

      <div className="cards">

        {/* tiếng Đức */}
        <div className="card">

          <div className="badge">
            1. TIẾNG ĐỨC
          </div>

          <div className="word">
            {loading ? "Đang xử lý..." : result.de}
          </div>

          <div className="meaning">
            <b>Từ loại:</b> {result.deType}
          </div>

          <div className="reading">
            Cách đọc: {result.deRead}
          </div>

          <button
            onClick={() => speak(result.de, "de-DE")}
          >
            🔊 Nghe từ Đức
          </button>

        </div>

        {/* ví dụ */}
        <div className="card">

          <div className="badge">
            2. VÍ DỤ KHI DÙNG
          </div>

          <div className="word">
            {result.deExample}
          </div>

          <div className="reading">
            Cách đọc: {result.deExampleRead}
          </div>

          <div className="meaning">
            <b>Nghĩa:</b> {result.meaning}
          </div>

          <button
            onClick={() => speak(result.deExample, "de-DE")}
          >
            🔊 Nghe câu Đức
          </button>

        </div>

        {/* tiếng Anh */}
        <div className="card">

          <div className="badge">
            3. TIẾNG ANH
          </div>

          <div className="word">
            {result.en}
          </div>

          <div className="meaning">
            <b>Word type:</b> {result.enType}
          </div>

          <div className="reading">
            Cách đọc: {result.enRead}
          </div>

          <div className="meaning">
            {result.enExample}
          </div>

          <button
            onClick={() => speak(result.en, "en-US")}
          >
            🔊 Listen English
          </button>

        </div>

      </div>

      {/* lịch sử */}
      <div className="history">

        <h2>Lịch sử tra nhanh</h2>

        <div className="history-list">

          {history.map((item, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() => setInput(item)}
            >
              {item}
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default App;