import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const commonSentences = [
    "Toi dang lam viec",
    "Toi khong hieu",
    "Xin noi cham lai",
    "Toi can nghi 5 phut",
    "Hom nay khoe khong?",
    "Cam on rat nhieu",
    "Toi yeu gia dinh toi",
    "Toi den tu Viet Nam",
    "Chuc ban mot ngay tot lanh",
    "Hen gap lai",
  ];

  const speak = (text, lang = "de-DE") => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handleTranslate = async (text) => {
    if (!text || text.trim() === "") return;

    try {
      setLoading(true);

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
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setResult({
        de: "Loi ket noi AI",
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
      <h1 className="title">THIEN THANH - Deutsch Schnell Lernen</h1>

      <p className="subtitle">
        Nhap tieng Viet, cac o tieng Duc - vi du - tieng Anh tu hien de hoc nhanh va dung ngay.
      </p>

      <div className="input-box">
        <h2>Nhap tieng Viet</h2>

        <input
          type="text"
          value={input}
          placeholder="Vi du: tinh yeu, luat kinh te..."
          onChange={(e) => setInput(e.target.value)}
        />

        <p className="note">
          Chi can nhap, khong can bam nut.
        </p>
      </div>

      <div className="cards">
        <div className="card">
          <div className="badge">1. TIENG DUC</div>

          <div className="word">
            {loading ? "Dang xu ly..." : result.de}
          </div>

          <div className="meaning">
            <b>Tu loai:</b> {result.deType}
          </div>

          <div className="reading">
            Cach doc: {result.deRead}
          </div>

          <button onClick={() => speak(result.de, "de-DE")}>
            Nghe tu Duc
          </button>
        </div>

        <div className="card">
          <div className="badge">2. VI DU KHI DUNG</div>

          <div className="word">
            {result.deExample}
          </div>

          <div className="reading">
            Cach doc: {result.deExampleRead}
          </div>

          <div className="meaning">
            <b>Nghia:</b> {result.meaning}
          </div>

          <button onClick={() => speak(result.deExample, "de-DE")}>
            Nghe cau Duc
          </button>
        </div>

        <div className="card">
          <div className="badge">3. TIENG ANH</div>

          <div className="word">
            {result.en}
          </div>

          <div className="meaning">
            <b>Word type:</b> {result.enType}
          </div>

          <div className="reading">
            Cach doc: {result.enRead}
          </div>

          <div className="meaning">
            {result.enExample}
          </div>

          <button onClick={() => speak(result.en, "en-US")}>
            Listen English
          </button>
        </div>
      </div>

      <div className="history">
        <h2>Mot so cau thong dung</h2>

        <div className="history-list">
          {commonSentences.map((item, index) => (
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