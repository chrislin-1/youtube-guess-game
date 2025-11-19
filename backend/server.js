import express from "express";
import cors from "cors";
import db from "./db.js";  // <-- single Knex instance

const app = express();
app.use(cors());
app.use(express.json());

// Get today's video from DB
app.get("/api/today", async (req, res) => {
  try {
    const rows = await db("daily_video")
      .select("data")
      .orderBy("id", "desc")
      .limit(1);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No daily video set yet" });
    }

    res.json(rows[0].data);
  } catch (error) {
    console.error("Error fetching daily video:", error.message);
    res.status(500).json({ error: "Database query failed" });
  }
});

// POST endpoint to save game result
app.post("/api/results", async (req, res) => {
  try {
    const { user_id, game_date, guesses, won } = req.body;

    if (!game_date || guesses === undefined || won === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db("game_results").insert({
      user_id,
      game_date,
      guesses,
      won
    });

    res.status(201).json({ message: "Result saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save result" });
  }
});

// GET endpoint for today's stats
app.get("/api/stats/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const totalGamesQuery = await db("game_results")
      .count("* as count")
      .where("game_date", today);
    const totalGames = parseInt(totalGamesQuery[0].count);

    const totalWinsQuery = await db("game_results")
      .count("* as count")
      .where("game_date", today)
      .andWhere("won", true);
    const totalWins = parseInt(totalWinsQuery[0].count);

    const winRate = totalGames ? (totalWins / totalGames) * 100 : 0;

    const guessesQuery = await db("game_results")
      .select("guesses")
      .count("* as count")
      .where("game_date", today)
      .andWhere("won", true)
      .groupBy("guesses");

    const guessDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    guessesQuery.forEach(row => {
      guessDistribution[row.guesses] = ((row.count / totalGames) * 100).toFixed();
    });

    res.json({
      totalGames,
      totalWins,
      winRate: winRate.toFixed(),
      guessDistribution
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
