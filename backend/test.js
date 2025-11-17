import db from "./db.js";

async function testConnection() {
  try {
    const result = await db.raw("SELECT NOW() AS now");
    console.log("✅ DB connection successful:", result.rows);
    process.exit(0);
  } catch (err) {
    console.log("the database url is....", process.env.DATABASE_URL);
    console.log("the production environment is", process.env.NODE_ENV);
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}

testConnection();
