import fs from "fs";

// Load top videos
const videos = JSON.parse(fs.readFileSync("./top_videos.json", "utf-8"));

// Pick a random video
const random = Math.floor(Math.random() * videos.length);
const todayVideo = videos[random];

// Save to db.json
const db = {
  date: new Date().toISOString().slice(0, 10),
  todayVideo,
};

fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));
console.log(`✅ New daily video selected: ${todayVideo.snippet.title}`);
