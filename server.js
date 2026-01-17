import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Statische Dateien (HTML, CSS, JS) aus public/
app.use(express.static(path.join(__dirname, "public")));

// === Zugangscodes ===
const ACCESS_CODES = ["YT-SECRET-123", "YT-SECRET-456", "YT-SECRET-789"];

// === Daily Hints + Amazon-Code-Fragmente ===
const hints = {
  "2026-01-17": { hint: "Schau bei Minute 3:42 👀", codePart: "AB12" },
  "2026-01-18": { hint: "Video X, Sekunde 1:15 🔑", codePart: "CD34" },
  "2026-01-19": { hint: "Minute 2:05, Puzzle lösen 🧩", codePart: "EF56" }
};

// === Health Check Endpoint (hält Railway Container alive) ===
app.get("/health", (req, res) => {
  res.send("OK ✅ Server lebt");
});

// === Login-Endpunkt ===
app.post("/login", (req, res) => {
  const { code } = req.body;
  console.log("Eingegebener Code:", code); // Debug
  if (!ACCESS_CODES.includes(code)) return res.status(401).json({ ok: false });
  res.json({ ok: true });
});

// === Daily Hint-Endpunkt ===
app.get("/daily-hint", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const todayData = hints[today];
  if (!todayData) return res.json({ hint: "Heute noch kein Hinweis." });

  res.json({ hint: todayData.hint, codePart: todayData.codePart });
});

// === Alles auf PORT warten lassen ===
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server läuft auf Port", PORT));

// === Optional: Prevent idle shutdown (Railway friendly ping) ===
setInterval(() => {
  fetch(`http://localhost:${PORT}/health`).catch(() => {});
}, 25_000); // alle 25 Sekunden
