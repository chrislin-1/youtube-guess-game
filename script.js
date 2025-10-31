//const API_KEY = "AIzaSyCQ609JrmDhgRyajrZ2GT1RIBchIWhFyf8";

const MAX_GUESSES = 6;
const placeholderImg = "https://www.shutterstock.com/image-vector/youtube-error-grey-icon-this-260nw-1962406363.jpg";
const hintBox = document.getElementById("hint-output");

function initializeHintBox() {
  hintBox.innerHTML = ""; // Clear old content
  for (let i = 0; i < MAX_GUESSES; i++) {
    const hintItem = document.createElement("div");
    hintItem.className = "hint-item";
    hintItem.innerHTML = `
      <div class="hint-inner">
        <div class="hint-front">
          <img src="${placeholderImg}" alt="Empty guess" class="hint-thumbnail">
          <div class="hint-info">
            <p class="hint-text">No guess yet</p>
          </div>
        </div>
        <div class="hint-back">
          <img src="${placeholderImg}" alt="Guess result" class="hint-thumbnail">
          <div class="hint-info">
            <p class="hint-text">Result</p>
          </div>
        </div>
      </div>
    `;
    hintBox.appendChild(hintItem);
  }
}

initializeHintBox();

// write to console showing all videos stored in Database
const topVideos = JSON.parse(localStorage.getItem("topVideos")) || [];

//choose video and pull necessary info
const todayVideo = JSON.parse(localStorage.getItem("todayVideo"));
console.log(todayVideo);
const todayViews = todayVideo.statistics.viewCount;
const todayTitle = todayVideo.snippet.title.toLowerCase();
const todayChannel = todayVideo.snippet.channelTitle;
const todayThumbnail = todayVideo.snippet.thumbnails.high.url;
const todayId = todayVideo.id;
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const videoDate = new Date(todayVideo.snippet.publishedAt);
const videoYear = videoDate.getFullYear();
todayDescription = todayVideo.snippet.description;
const todayDate = videoDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric"
});
const yearsAgo = currentYear - videoYear;
const channelThumbnail = todayVideo.channelThumbnail;

console.log(`today video is ${todayVideo.snippet.title}`);

//get elements from html
const searchInput = document.getElementById("search-input");
const suggestionsContainer = document.getElementById("suggestions");

const videoContainer = document.getElementById("video-container");
videoContainer.innerHTML = `
  <div class="video-player-section">
    <iframe
      width="640"
      height="360"
      src="https://www.youtube.com/embed/${todayId}"
      title="${todayVideo.snippet.title}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>

  <div class="video-info-section">
    <h2 class="video-title">${todayTitle}</h2>
    <div id="channel-section">
      <img src="${channelThumbnail}" alt="${todayTitle}" class="channel-thumbnail">
      <p class="video-channel">${todayChannel}</p>
    </div>
    <div id="description-section">
      <div id="views-date">
        <h3 id="views">________views</p>
        <h3 id="date">${yearsAgo} years ago</p>
      </div>
        <p id="description">Guess the number of views the viral YouTube video has. Your guess is considered close if it's within 30% of the answer, and will be considered correct if within 5%.</p>
    </div>
  </div>
`;

console.log(`today views is ${todayViews}`);

// --- Modal Elements ---
const modal = document.getElementById("result-modal");
const closeModal = document.getElementById("close-modal");
const resultTitle = document.getElementById("result-title");
const resultGif = document.getElementById("result-gif");

///////////////////// Function to show modal (win loss graphic) ////////////////////
function showResultModal(won) {
  if (won) {
    resultTitle.textContent = "🎉 Well Done... You internet gremlin";
    resultGif.src = "https://gifsec.com/wp-content/uploads/2021/11/like-a-boss-gif-1.gif"; // confetti GIF
  } else {
    resultTitle.textContent = "😢 You lost, but at least you're not an internet loser?";
    resultGif.src = "https://i0.wp.com/badbooksgoodtimes.com/wp-content/uploads/2013/06/threw-it-on-the-ground-1.gif?fit=389%2C219&ssl=1"; // sad GIF
  }

  modal.classList.remove("hidden");
}

// Function to hide modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Optional: click outside modal to close
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
////////////////////////////////////////////////////////////////////////////////////

let guessCount = 0;
document.getElementById("search-button").addEventListener("click", () => {
  if (guessCount >= MAX_GUESSES) return; // stop at 6 guesses
  const query = document.getElementById("search-input").value;
  const guessViews = Number(query.replace(/,/g, "")); 
  const guessFormatted = guessViews.toLocaleString();
  const answerFormatted = Number(todayViews).toLocaleString();
  const viewsElement = document.getElementById("views");

  const ViewDifference = todayViews - guessViews;
  let guessThumbnail = "";
  let guessText = "";

  // Grab current hint, set back of card
  const hintItems = document.querySelectorAll(".hint-item");
  const hintBacks = document.querySelectorAll(".hint-back");
  const currentHint = hintItems[guessCount];
  const currentBack = hintBacks[guessCount];
  const backImg = currentHint.querySelector(".hint-back img");
  const backText = currentHint.querySelector(".hint-back .hint-text");
  


  if (Math.abs(ViewDifference) < 0.05 * todayViews) {
    guessThumbnail = todayThumbnail; // correct!
    guessText = `✅ Correct! ${answerFormatted} views`;
    viewsElement.textContent = `${answerFormatted} views`;
    viewsElement.style.color = "green";
    currentBack.style.backgroundColor = "green";
    showResultModal(true);
  } else if (ViewDifference > 0) {
    guessThumbnail = "https://www.kindpng.com/picc/m/20-200332_youtube-facebook-like-button-blog-facebook-hd-png.png";
    if (Math.abs(ViewDifference) < 0.3 * todayViews) {
      currentBack.style.backgroundColor = "#FFBF00";
      guessText = `${guessFormatted} — You're close...`;
    }
    else {
      currentBack.style.backgroundColor = "#c00";
      guessText = `${guessFormatted} — You're way off...`;
    }
    //SHOW RESULTS IF MAX GUESSES REACHED
    if(guessCount >= MAX_GUESSES - 1) showResultModal(false);
  } else {
    guessThumbnail = "https://innovation-village.com/wp-content/uploads/2021/04/youtube-dislike-download-icon-3.jpeg";
    if (Math.abs(ViewDifference) < 0.3 * todayViews) {
      currentBack.style.backgroundColor = "#FFBF00";
      guessText = `${guessFormatted} — You're close...`;
    }
    else {
      currentBack.style.backgroundColor = "#c00";
      guessText = `${guessFormatted} — You're way off...`;
    }
    //SHOW RESULTS IF MAX GUESSES REACHED
    if(guessCount >= MAX_GUESSES - 1) showResultModal(false);
  }

  backImg.src = guessThumbnail;
  backText.textContent = guessText;

  // Clear search bar
  searchInput.value = "";

  // Flip animation
  currentHint.classList.add("flip");

  // Increment guess
  guessCount++;
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission reload
    document.getElementById("search-button").click();
  }
});