import db from "./db.js";

async function testConnection() {
  try {
    const result = await db.raw("SELECT NOW() AS now");
    console.log("✅ DB connection successful:", result.rows);
    process.exit(0);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}

testConnection();
