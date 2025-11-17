import db from "./db.js";

async function testConnection() {
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
    console.log("✅ DB connection successful:", result.rows);
    process.exit(0);
  } catch (err) {
    console.log("the database url is....", process.env.DATABASE_URL);
    console.log("the ")
    console.log("the production environment is", process.env.NODE_ENV);
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}

testConnection();
