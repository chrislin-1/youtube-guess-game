import express from "express";
import cors from "cors";
import pkg from "pg";

const { Client } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// Create a single persistent database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Needed for Railway’s SSL setup
});
await client.connect();

// Get today’s video from DB
app.get("/api/today", async (req, res) => {
  try {
    const { rows } = await client.query(
      "SELECT data FROM daily_video ORDER BY date DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No daily video set yet" });
    }

    res.json(rows[0].data);
  } catch (error) {
    console.error("Error fetching daily video:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});


// Post player stats
app.post("/api/stats", (req, res) => {
  const data = loadData();
  const { player, won } = req.body;

  if (!player) {
    return res.status(400).json({ error: "Player name required" });
  }

  const entry = {
    player,
    won,
    timestamp: new Date().toISOString(),
  };

  data.stats.push(entry);
  saveData(data);
  res.json({ message: "Stats saved!", entry });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
