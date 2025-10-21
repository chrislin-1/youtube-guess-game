const API_KEY = "AIzaSyCQ609JrmDhgRyajrZ2GT1RIBchIWhFyf8";

// Fetch top 100 most popular videos and store them in localStorage
async function fetchTopVideos() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`
    );
    const data = await response.json();

    // Save to localStorage so you can use it in script.js
    localStorage.setItem("topVideos", JSON.stringify(data.items));
    console.log("✅ Top videos saved locally!");
  } catch (error) {
    console.error("Error fetching top videos:", error);
  }
}

// Only run once to load top videos
fetchTopVideos();

/*
const fetch = require("node-fetch"); // If you're using Node.js
const fs = require("fs");

const API_KEY = "AIzaSyCQ609JrmDhgRyajrZ2GT1RIBchIWhFyf8";
const MAX_RESULTS = 50;
const TOTAL_RESULTS = 1000;
const REGION = "US";

let allVideos = [];

async function fetchPopularVideos(pageToken = "", count = 0) {
  if (count >= TOTAL_RESULTS) {
    fs.writeFileSync("top_videos.json", JSON.stringify(allVideos, null, 2));
    console.log("✅ Saved top videos to file!");
    return;
  }

  let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=${MAX_RESULTS}&regionCode=${REGION}&key=${API_KEY}`;
  if (pageToken) url += `&pageToken=${pageToken}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.items) {
    allVideos.push(...data.items);
    console.log(`Fetched ${allVideos.length} videos...`);
  }

  if (data.nextPageToken && allVideos.length < TOTAL_RESULTS) {
    await fetchPopularVideos(data.nextPageToken, allVideos.length);
  } else {
    fs.writeFileSync("top_videos.json", JSON.stringify(allVideos, null, 2));
    console.log("✅ Done. Saved to file.");
  }
}

fetchPopularVideos();
*/