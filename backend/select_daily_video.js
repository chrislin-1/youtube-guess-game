import fs from "fs";
import db from "./db.js";   // <--- use your shared Knex instance

async function selectDailyVideo() {
  try {
    // Load video list
    const videos = JSON.parse(fs.readFileSync("./top_videos.json", "utf-8"));

    // Pick a random video
    const random = Math.floor(Math.random() * videos.length);
    const todayVideo = videos[random];

    // Replace yesterday’s daily video
    await db("daily_video").del(); // DELETE FROM daily_video;
    await db("daily_video").insert({ data: todayVideo }); // INSERT new row

    console.log(`✅ New daily video selected: ${todayVideo.snippet.title}`);

  } catch (err) {
    console.error("❌ Failed to select daily video:", err);
  } finally {
    // IMPORTANT: close Knex so Node exits cleanly
    await db.destroy();
  }
}

selectDailyVideo();
