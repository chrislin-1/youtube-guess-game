////////////////////// CHANG API BASE FOR DEV VS PROD //////////////////////
const API_BASE = "https://you tube-guess-game-production.up.railway.app";
//const API_BASE = "http://localhost:8080"; 


async function loadTodayVideo() {
  const response = await fetch(`${API_BASE}/api/today`);
  const todayVideo = await response.json();
  console.log("Today's video:", todayVideo);
  return todayVideo;
}

const MAX_GUESSES = 6;
const placeholderImg = "images/dogofwisdom.webp";
const hintBox = document.getElementById("hint-output");

const isMobile = window.matchMedia("(max-width: 900px)").matches;

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
            <p class="hint-text">?????? views</p>
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

/////////////// NOV 3: GENERATED JSON FILE OF VIDEOS OFFLINE, NO API CALL NEEDED FOR PLAYERS ANYMORE //////////////
async function loadTopVideos() {
  /*choose video 
  const response = await fetch("top_videos.json");
  const topVideos = await response.json();
  */
 
  const todayVideo = await loadTodayVideo();
  
  /*/ Select your daily video from this list
  const random = Math.floor(Math.random() * topVideos.length);
  const todayVideo = topVideos[random];
  */

  ////////////// MOVED ALL GAME LOGIC INSIDE FUNCTION SO THAT todayVideo CAN BE USED ////////////////
  const instructionsModal = document.getElementById("instructions-modal");
  // Show instructions on load
  function handleWindowLoad() {
    instructionsModal.style.display = "flex";
  }
  window.addEventListener("load", handleWindowLoad);

  // Close instructions and start game
  function handleInstructionsModalClick(e) {
    if (e.target === instructionsModal) {
      instructionsModal.classList.add("hidden");
    }
  }
  window.addEventListener("click", handleInstructionsModalClick);

  //set variables
  console.log(todayVideo);
  const todayViews = todayVideo.statistics.viewCount;
  const answerFormatted = Number(todayViews).toLocaleString();
  const todayTitle = todayVideo.snippet.title;
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
          <h3 id="views">?????? views</h3>
          <h3 id="date">${yearsAgo} years ago</h3>
        </div>
        <p class="description"> ${todayDescription}</p>
      </div>
    </div>
  `;

  ////////////////////// MOBILE ADJUSTMENTS //////////////////////
  if(isMobile){
    const header = document.getElementById("youdle-header");
    header.innerHTML = `
      <div class="menu-left">
        <button id="menu-bars" class="menu-button">
          <img class="menu-icon" src="images/menu-mobile.png" alt="menu">
        </button>
        <img class="menu-icon" src="images/nyancat.webp" alt="Youdle Logo" width="50"/>
      </div>
      <h1 id="title">You<span style="color: white;">Dle</span></h1>
      <div class="menu-right">
        <button id="how-to-button" class="menu-button">
          <img class="menu-icon" src="images/how-to-mobile.png" alt="Question icons created by Shashank Singh - Flaticon"></img>
        </button>
        <button id="history-button" class="menu-button">
          <img class="menu-icon" src="images/history-mobile.png" alt="History icons created by Tempo_doloe - Flaticon"></img>
        </button>
      </div>
    `

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
        <div id="description-section">
          <div id="views-date">
            <p id="views">?????? views</p>
            <p id="date">${yearsAgo} years ago</p>
          </div>
        </div>
        <div id="channel-section">
          <img src="${channelThumbnail}" alt="${todayTitle}" class="channel-thumbnail">
          <p class="video-channel">${todayChannel}</p>
        </div>
      </div>
    `;
  }

  console.log(`today views is ${todayViews}`);

  // --- Modal Elements ---
  const modal = document.getElementById("result-modal");
  const closeModal = document.getElementById("close-modal");
  const closeResults = document.getElementById("close-results");
  const resultTitle = document.getElementById("result-title");
  const resultGif = document.getElementById("result-gif");

  ///////////////////// Function to show modal (win loss graphic) ////////////////////
  function showResultModal(won) {
    if (won) {
      resultTitle.textContent = "🎉 Well Done... You internet gremlin";
      resultGif.src = "https://gifsec.com/wp-content/uploads/2021/11/like-a-boss-gif-1.gif"; // confetti GIF
    } else {
      resultTitle.innerHTML = `😢 You lost, but at least you're not an internet loser? Today's video has <span style=color:red>${answerFormatted} views</span>`;
      resultGif.src = "https://i0.wp.com/badbooksgoodtimes.com/wp-content/uploads/2013/06/threw-it-on-the-ground-1.gif?fit=389%2C219&ssl=1"; // sad GIF
    }
    modal.classList.remove("hidden");
  }

  // Function to hide instructions modal 
  function handleCloseModalClick() {
    instructionsModal.classList.add("hidden");
  }
  closeModal.addEventListener("click", handleCloseModalClick);

  // Function to hide results modal 
  function handleCloseResultsClick() {
    modal.classList.add("hidden");
  }
  closeResults.addEventListener("click", handleCloseResultsClick);

  // Optional: click outside modal to close both modals
  function handleModalClick(e) {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  }
  window.addEventListener("click", handleModalClick);
  ////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////// LIVE INPUT FORMATTING  ////////////////////////////////
  function handleSearchInput(e) {
    let guess = e.target.value;

    // Remove all non-digit characters
    guess = guess.replace(/\D/g, "");

    // If empty, clear field
    if (!guess) {
      e.target.value = "";
      return;
    }

    // Convert to number and format with commas
    const numberValue = parseInt(guess, 10);
    e.target.value = numberValue.toLocaleString();
  }
  searchInput.addEventListener("input", handleSearchInput);
  
  //////////////////////////// SUBMITTED ANSWER LOGIC ////////////////////////////////
  let guessCount = 0;
  function handleSearchButtonClick() {
    if (guessCount >= MAX_GUESSES) return; // stop at 6 guesses
    const query = searchInput.value;
    const guessViews = Number(query.replace(/,/g, "")); 
    const guessFormatted = guessViews.toLocaleString();
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
      endGame();
      submitResult(true, guessCount + 1);
      showStats();
    } else if (ViewDifference > 0) {
        guessThumbnail = "images/up.png";
        backImg.textContent="Like icons created by Gregor Cresnar - Flaticon";
        backImg.classList.add("icon");
      if (Math.abs(ViewDifference) < 0.3 * todayViews) {
        currentBack.style.backgroundColor = "#FFBF00";
        guessText = `${guessFormatted} — You're close...`;
      }
      else {
        currentBack.style.backgroundColor = "#c00";
        guessText = `${guessFormatted} — You're way off...`;
      }
      //SHOW RESULTS IF MAX GUESSES REACHED
      if(guessCount >= MAX_GUESSES - 1) {
        viewsElement.textContent = `${answerFormatted} views`;
        console.log(`incorrect, the video has ${answerFormatted} views`)
        showResultModal(false);
        endGame();
        submitResult(false, guessCount + 1);
        console.log("submitting loss");
        showStats();
      } 
    } else {
        guessThumbnail = "images/down.png";
        backImg.textContent="Thumb down icons created by lalawidi - Flaticon";
        backImg.classList.add("icon");
      if (Math.abs(ViewDifference) < 0.3 * todayViews) {
        currentBack.style.backgroundColor = "#FFBF00";
        guessText = `${guessFormatted} — You're close...`;
      }
      else {
        currentBack.style.backgroundColor = "#c00";
        guessText = `${guessFormatted} — You're way off...`;
      }
      //SHOW RESULTS IF MAX GUESSES REACHED
      if(guessCount >= MAX_GUESSES - 1) {
        viewsElement.textContent = `${answerFormatted} views`;
        console.log(`incorrect, the video has ${answerFormatted} views`)
        showResultModal(false);
        endGame();
        submitResult(false, guessCount + 1);
        showStats();
      }
    }

    backImg.src = guessThumbnail;
    backText.textContent = guessText;

    // Clear search bar
    searchInput.value = "";

    // Flip animation
    currentHint.classList.add("flip");

    // Increment guess
    guessCount++;
  }

  async function showStats() {
    try {
      const res = await fetch(`${API_BASE}/api/stats/today`);
      const stats = await res.json();

      // Update simple numbers
      document.getElementById("total-games").textContent = stats.totalGames;
      document.getElementById("win-rate").textContent = stats.winRate + "%";

      // Render guess distribution
      const container = document.getElementById("guess-distribution");
      container.innerHTML = ""; // clear old

      // Find longest bar by taking max percent of winners guesses and loser percent
      const lossPercent = 100 - stats.winRate;
      let maxPercent = Math.max(...Object.values(stats.guessDistribution), lossPercent);
      for (let i = 1; i <= 6; i++) {
        const percent = stats.guessDistribution[i] || 0;

        container.innerHTML += `
          <div class="guess-bar">
            <div class="guess-label">${i}</div>
            <div class="guess-fill" style="width: ${(percent / maxPercent) * 100}%; max-width: 80%;"></div>
            <div class="guess-percent">${percent}%</div>
          </div>
        `;
      }

      container.innerHTML += `
        <div class="guess-bar">
          <div class="guess-label">${"😢"}</div>
          <div class="guess-fill" style="width: ${(lossPercent / maxPercent) * 100}%; max-width: 80%;"></div>
          <div class="guess-percent">${lossPercent}%</div>
        </div>
      `;

    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }

  function endGame() {
    searchInput.removeEventListener("input", handleSearchInput);
    document.getElementById("search-button").removeEventListener("click", handleSearchButtonClick);
    searchInput.removeEventListener("keypress", handleSearchInputKeypress);
    searchInput.disabled = true;
    // show result modal, etc.
  }

  async function submitResult(gameWon, numGuesses) {
    const gameDate = new Date().toISOString().split("T")[0];
  
    await fetch(`${API_BASE}/api/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "anonymous", // optional for now
        game_date: gameDate,
        guesses: numGuesses,
        won: gameWon
      })
    });
  }

  document.getElementById("search-button").addEventListener("click", handleSearchButtonClick);

  function handleSearchInputKeypress(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission reload
      document.getElementById("search-button").click();
    }
  }
  searchInput.addEventListener("keypress", handleSearchInputKeypress);

  const infoButton = document.getElementById('how-to-button');
  function handleInfoButtonClick() {
    instructionsModal.classList.remove("hidden");    
  }
  infoButton.addEventListener("click", handleInfoButtonClick);
}

loadTopVideos();