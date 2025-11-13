import fs from "fs";
import pkg from "pg";

const { Client } = pkg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

await client.connect();

const videos = JSON.parse(fs.readFileSync("./top_videos.json", "utf-8"));
const random = Math.floor(Math.random() * videos.length);
const todayVideo = videos[random];

// Insert new video, replacing yesterday’s
await client.query("DELETE FROM daily_video;");
await client.query("INSERT INTO daily_video (data) VALUES ($1);", [todayVideo]);

console.log(`✅ New daily video selected: ${todayVideo.snippet.title}`);

await client.end();
