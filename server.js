const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static("public"));

/* =========================
   KONFIG
========================= */
const START_DATE = new Date("2026-01-15"); // Start der Aktion
const TOTAL_GAMES = 5;
const VALID_CODES = ["A1", "B2", "C3", "D4", "E5", "F6"];

/* =========================
   DATEN
========================= */
const DATA_FILE = "./data.json";

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ players: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* =========================
   HILFSFUNKTIONEN
========================= */
function currentWeek() {
  const now = new Date();
  const diff = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.floor(diff / 7) + 1);
}

function getUnlockedGames() {
  return Math.min(currentWeek(), TOTAL_GAMES);
}

function uniqueNickname(name, players) {
  let final = name;
  let i = 1;
  while (players[final]) {
    final = `${name}${i}`;
    i++;
  }
  return final;
}

/* =========================
   LOGIN / REGISTRIERUNG
========================= */
app.post("/login", (req, res) => {
  const { nickname } = req.body;
  if (!nickname) return res.status(400).send("Kein Nickname");

  const data = loadData();
  const finalName = uniqueNickname(nickname, data.players);

  if (!data.players[finalName]) {
    data.players[finalName] = {
      codes: [],
      games: {},
      score: 0,
      created: new Date().toISOString()
    };
  }

  saveData(data);
  res.json({ nickname: finalName });
});

/* =========================
   CODE EINGEBEN
========================= */
app.post("/submit-code", (req, res) => {
  const { nickname, code } = req.body;
  const data = loadData();

  if (!data.players[nickname]) return res.status(400).send("Unbekannter Spieler");
  if (!VALID_CODES.includes(code)) return res.status(400).send("Falscher Code");

  const player = data.players[nickname];

  if (player.codes.includes(code)) {
    return res.status(400).send("Code schon benutzt");
  }

  player.codes.push(code);
  player.score += 10;

  saveData(data);
  res.json({ success: true, score: player.score });
});

/* =========================
   SPIEL SCORE EINTRAGEN
========================= */
app.post("/submit-game", (req, res) => {
  const { nickname, gameId, score } = req.body;
  const data = loadData();

  const unlocked = getUnlockedGames();
  if (gameId > unlocked) return res.status(403).send("Spiel gesperrt");

  const player = data.players[nickname];
  if (!player) return res.status(400).send("Unbekannter Spieler");

  // Spiel nur einmal werten
  if (player.games[gameId]) {
    return res.status(400).send("Spiel bereits abgeschlossen");
  }

  player.games[gameId] = score;
  player.score += score;

  saveData(data);
  res.json({ totalScore: player.score });
});

/* =========================
   SPIELE STATUS
========================= */
app.get("/games", (req, res) => {
  res.json({
    currentWeek: currentWeek(),
    unlockedGames: getUnlockedGames(),
    totalGames: TOTAL_GAMES
  });
});

/* =========================
   LEADERBOARD
========================= */
app.get("/leaderboard", (req, res) => {
  const data = loadData();

  const board = Object.entries(data.players)
    .map(([name, p]) => ({
      nickname: name,
      score: p.score,
      codes: p.codes.length,
      gamesPlayed: Object.keys(p.games).length
    }))
    .sort((a, b) => b.score - a.score);

  res.json(board);
});

/* =========================
   SERVER START
========================= */
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
