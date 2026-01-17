import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server läuft ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server gestartet auf Port", PORT);
});
