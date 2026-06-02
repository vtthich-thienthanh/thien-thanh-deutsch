* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f4f7fb;
  color: #111827;
}

.app {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 10px;
  color: #0f172a;
}

.subtitle {
  text-align: center;
  font-size: 20px;
  margin-bottom: 30px;
  color: #334155;
}

.input-box {
  background: white;
  border-radius: 25px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.input-box h2 {
  text-align: center;
  margin-bottom: 15px;
  color: #0f172a;
}

.input-box input {
  width: 100%;
  padding: 18px;
  border-radius: 18px;
  border: 3px solid #111827;
  font-size: 32px;
  font-weight: bold;
  background: #000;
  color: white;
}

.note {
  text-align: center;
  margin-top: 12px;
  color: #64748b;
  font-size: 18px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

.card {
  background: white;
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
  text-align: center;
}

.badge {
  display: inline-block;
  background: #dbeafe;
  color: #0369a1;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 18px;
}

.word {
  font-size: 54px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 18px;
  line-height: 1.2;
}

.reading {
  color: #b45309;
  font-size: 28px;
  font-weight: bold;
  margin: 15px 0;
}

.meaning {
  font-size: 24px;
  color: #1e293b;
  line-height: 1.5;
}

button {
  margin-top: 18px;
  background: #0f172a;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #1e293b;
}

.history {
  margin-top: 40px;
  background: white;
  padding: 25px;
  border-radius: 25px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
}

.history h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #0f172a;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-item {
  background: #e2e8f0;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .input-box input {
    font-size: 24px;
    padding: 14px;
  }

  .word {
    font-size: 42px;
  }

  .reading {
    font-size: 22px;
  }

  .meaning {
    font-size: 20px;
  }

  button {
    width: 100%;
  }
}