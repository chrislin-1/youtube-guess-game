const API_KEY = "AIzaSyCQ609JrmDhgRyajrZ2GT1RIBchIWhFyf8";

/////////////////// NEW ITERATION WITH CUSTOM YOUTUBE VIDEO PLAYLIST /////////////////
// 🟢 Replace this with your own playlist ID
const PLAYLIST_ID = "PL7o7Hbc7GS5sTCDAzsDRKBNvf67P7lpo6"; // example: popular music videos

async function fetchTopVideos() {
  try {
    // 1️⃣ Step 1: Get playlist items (video IDs only)
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
    );
    const playlistData = await playlistResponse.json();

    const videoIds = playlistData.items
      .map(item => item.contentDetails.videoId)
      .join(",");

    // 2️⃣ Step 2: Fetch full video details using those IDs
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,status&id=${videoIds}&key=${API_KEY}`
    );
    const videoData = await videoResponse.json();

    const topVideos = videoData.items;

    // 3️⃣ Step 3: Pick a random "today" video
    const random = Math.floor(Math.random() * topVideos.length);
    const todayVideo = topVideos[random];
    const channelId = todayVideo.snippet.channelId;

    // 4️⃣ Step 4: Fetch channel details (for logo)
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
    );
    const channelData = await channelResponse.json();
    const channelThumbnail =
      channelData.items[0].snippet.thumbnails.default.url;

    // Add channel thumbnail directly to the video object
    todayVideo.channelThumbnail = channelThumbnail;

    // 5️⃣ Step 5: Store results locally
    localStorage.setItem("topVideos", JSON.stringify(topVideos));
    localStorage.setItem("todayVideo", JSON.stringify(todayVideo));

    console.log("✅ Playlist videos saved locally!");
  } catch (error) {
    console.error("Error fetching playlist videos:", error);
  }
}

// Run once to load playlist videos
fetchTopVideos();