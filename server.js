import express from "express";
const app = express();
app.use(express.json());

// Statische Dateien aus public/
app.use(express.static("public"));

// Login-Endpunkt
const ACCESS_CODES = ["YT-SECRET-123"];
app.post("/login", (req, res) => {
  const { code } = req.body;
  if (!ACCESS_CODES.includes(code)) return res.status(401).json({ ok: false });
  res.json({ ok: true });
});

// Daily Hint
app.get("/daily-hint", (req, res) => {
  const hints = { "2026-01-17": "Schau bei Minute 3:42 👀" };
  const today = new Date().toISOString().slice(0, 10);
  res.json({ hint: hints[today] || "Heute nichts gefunden." });
});

app.listen(process.env.PORT || 3000, () => console.log("Server läuft ✅"));
