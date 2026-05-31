import React, { useEffect, useState } from "react";

const HISTORY_KEY = "thien_thanh_german_ai_history_v1";

const demoData = {
  "hết giờ": {
    vi: "hết giờ",
    de: "Feierabend",
    deType: "Nomen, maskulin: der Feierabend",
    deRead: "fai-ờ-a-bần",
    deExample: "Ich habe jetzt Feierabend.",
    deExampleRead: "Ích ha-bờ dét fai-ờ-a-bần.",
    viMeaning: "Bây giờ tôi hết giờ làm.",
    en: "end of work / quitting time",
    enType: "noun phrase",
    enRead: "enđ ờv wơrk / quít-ting taim",
    enExample: "I have finished work now.",
  },
  "nghỉ giải lao": {
    vi: "nghỉ giải lao",
    de: "die Pause",
    deType: "Nomen, feminin",
    deRead: "đi pau-zờ",
    deExample: "Ich mache jetzt eine Pause.",
    deExampleRead: "Ích ma-khờ dét ai-nờ pau-zờ.",
    viMeaning: "Bây giờ tôi nghỉ giải lao.",
    en: "break",
    enType: "noun",
    enRead: "brâyk",
    enExample: "I am taking a break now.",
  },
  "tôi không hiểu": {
    vi: "tôi không hiểu",
    de: "Ich verstehe nicht.",
    deType: "Satz",
    deRead: "ích phẹa-stê-ờ nịch",
    deExample: "Ich verstehe nicht. Können Sie bitte langsam sprechen?",
    deExampleRead: "Ích phẹa-stê-ờ nịch. Cơn-nần zi bít-tờ lang-zam sờ-pờ-re-khần?",
    viMeaning: "Tôi không hiểu. Ông/bà có thể nói chậm lại được không?",
    en: "I do not understand.",
    enType: "sentence",
    enRead: "ai đu nót ân-đờ-stenđ",
    enExample: "I do not understand. Could you please speak slowly?",
  },
};

function getDemo(input) {
  const key = String(input || "").toLowerCase().trim();
  if (demoData[key]) return demoData[key];
  return {
    vi: input,
    de: "AI cần được kết nối",
    deType: "Hinweis / ghi chú",
    deRead: "",
    deExample: "Bitte verbinden Sie die OpenAI API, um jedes neue Wort automatisch zu übersetzen.",
    deExampleRead: "Bít-tờ fea-bin-đần zi đi OpenAI API, um yê-đét noi-ờ voạt ao-tô-ma-tích chu uy-bờ-zét-sần.",
    viMeaning: "Bản giao diện đã sẵn sàng. Để tra mọi từ bất kỳ, cần thêm API key trong Vercel.",
    en: "AI connection required",
    enType: "note",
    enRead: "ây-ai cờ-nék-shần ri-quai-ờd",
    enExample: "Connect the OpenAI API to translate any new word automatically.",
  };
}

function speak(text, lang) {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.82;
  window.speechSynthesis.speak(utter);
}

async function askAI(input) {
  const res = await fetch("/api/german", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input }),
  });
  if (!res.ok) throw new Error("API chưa sẵn sàng");
  return await res.json();
}

export default function GermanQuickStudyAI() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveHistory = (item) => {
    const next = [item, ...history.filter((x) => x.vi !== item.vi)].slice(0, 20);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const runSearch = async (text) => {
    const searchText = String(text || "").trim();
    if (!searchText) {
      setResult(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const aiResult = await askAI(searchText);
      setResult(aiResult);
      saveHistory(aiResult);
    } catch {
      const fallback = getDemo(searchText);
      setResult(fallback);
      saveHistory(fallback);
      setError("Bản xem trước: sau khi thêm API key trên Vercel, nhập từ nào cũng tự ra kết quả thật.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const text = query.trim();
    if (!text) {
      setResult(null);
      setError("");
      return;
    }
    const timer = setTimeout(() => runSearch(text), 700);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="app">
      <div className="wrap">
        <header className="header">
          <h1>THIEN THANH – Deutsch Schnell Lernen</h1>
          <p>Nhập tiếng Việt, các ô tiếng Đức – ví dụ – tiếng Anh tự hiện để học nhanh và dùng ngay.</p>
        </header>

        <section className="card searchCard">
          <label>Nhập tiếng Việt</label>
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="VD: hết giờ, đau tay, tôi không hiểu..."
            autoFocus
          />
          <p className="hint">{loading ? "Đang tự tra..." : "Chỉ cần nhập, không cần bấm nút."}</p>
          {error && <p className="notice">⚠️ {error}</p>}
        </section>

        {result && (
          <main className="grid">
            <section className="card result deBox">
              <div className="tag">1. TIẾNG ĐỨC</div>
              <h2>{result.de}</h2>
              <p><b>Từ loại:</b> {result.deType}</p>
              <p><b>Cách đọc:</b> <span className="read">{result.deRead}</span></p>
              <button className="btn" onClick={() => speak(result.de, "de-DE")}>🔊 Nghe từ Đức</button>
            </section>

            <section className="card result exampleBox">
              <div className="tag">2. VÍ DỤ KHI DÙNG</div>
              <p className="sentence">{result.deExample}</p>
              <p><b>Cách đọc:</b> <span className="read">{result.deExampleRead}</span></p>
              <p><b>Nghĩa:</b> {result.viMeaning}</p>
              <button className="btn" onClick={() => speak(result.deExample, "de-DE")}>🔊 Nghe câu Đức</button>
            </section>

            <section className="card result enBox">
              <div className="tag">3. TIẾNG ANH</div>
              <h2>{result.en}</h2>
              <p><b>Word type:</b> {result.enType}</p>
              <p><b>Cách đọc:</b> <span className="read">{result.enRead}</span></p>
              <p className="sentence">{result.enExample}</p>
              <button className="btn" onClick={() => speak(result.enExample, "en-US")}>🔊 Listen English</button>
            </section>
          </main>
        )}

        {history.length > 0 && (
          <section className="card history">
            <h3>Lịch sử tra nhanh</h3>
            <div className="chips">
              {history.map((w, i) => (
                <button key={`${w.vi}-${i}`} className="chip" onClick={() => { setQuery(w.vi); setResult(w); }}>{w.vi}</button>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; background: #f4f7fb; color: #0f172a; }
        .app { min-height: 100vh; padding: 14px; }
        .wrap { max-width: 980px; margin: 0 auto; }
        .header { margin-bottom: 14px; }
        h1 { margin: 0; font-size: 26px; }
        h2 { margin: 8px 0 10px; font-size: 30px; }
        h3 { margin-top: 0; }
        p { line-height: 1.55; }
        .card { background: white; border: 1px solid #dbe3ef; border-radius: 18px; padding: 16px; box-shadow: 0 1px 2px rgba(15,23,42,.04); margin-bottom: 14px; }
        label { display: block; font-weight: 700; margin-bottom: 8px; }
        input { width: 100%; padding: 13px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 17px; }
        .search { font-size: 22px; font-weight: 700; }
        .hint { color: #64748b; margin: 8px 0 0; font-size: 14px; }
        .notice { color: #b45309; margin-bottom: 0; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .result { min-height: 230px; }
        .tag { display: inline-block; background: #e0f2fe; color: #075985; padding: 6px 10px; border-radius: 999px; font-weight: 700; font-size: 13px; }
        .read { color: #b45309; font-weight: 700; }
        .sentence { font-size: 20px; font-weight: 700; }
        .btn { border: none; background: #0f172a; color: white; border-radius: 12px; padding: 12px 14px; font-weight: 700; cursor: pointer; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 999px; padding: 8px 12px; cursor: pointer; }
        @media (max-width: 760px) {
          .app { padding: 10px; }
          h1 { font-size: 21px; }
          h2 { font-size: 28px; }
          .grid { grid-template-columns: 1fr; }
          .search { font-size: 20px; }
          .card { padding: 14px; border-radius: 16px; }
        }
      `}</style>
    </div>
  );
}
