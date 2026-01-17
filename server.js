import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server läuft ✅");
});

app.listen(process.env.PORT || 3000);
