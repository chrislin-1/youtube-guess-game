//const API_KEY = "AIzaSyCQ609JrmDhgRyajrZ2GT1RIBchIWhFyf8";

const topVideos = JSON.parse(localStorage.getItem("topVideos")) || [];

// write to console showing all videos stored in Database
console.log(topVideos);
/*
topVideos.forEach(video => {
    console.log(video.snippet.title);
});
*/

const searchInput = document.getElementById("search-input");
const suggestionsContainer = document.getElementById("suggestions");

const todayVideo = topVideos[0];
console.log(`today video is ${todayVideo.snippet.title}`);

// Listen for typing in the input field
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  suggestionsContainer.innerHTML = ""; // clear previous suggestions

  if (!query) return; // stop if input is empty

  // Filter videos by title match
  const filtered = topVideos
    .filter(video => 
      video.snippet.title.toLowerCase().includes(query)
    )
    .slice(0, 5); // limit to 5 results

  // Create clickable suggestion elements
  filtered.forEach(video => {
    const suggestion = document.createElement("div");
    suggestion.textContent = video.snippet.title;

    // When clicked, fill the input and clear suggestions
    suggestion.addEventListener("click", () => {
      searchInput.value = video.snippet.title;
      suggestionsContainer.innerHTML = "";
    });

    suggestionsContainer.appendChild(suggestion);
  });
});

// Optional: clear suggestions when clicking elsewhere
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
    suggestionsContainer.innerHTML = "";
  }
});

/*
// Use topVideos if available, otherwise fall back to mock data for testing
const videoDatabase = typeof topVideos !== "undefined" ? topVideos : [
    {
      title: "Cooking Tips for Beginners",
      channel: "Gordon Ramsay",
      views: 9348210,
      category: "Food",
      published: "2022-03-12",
    },
    {
      title: "10-Minute Workout",
      channel: "FitnessBlender",
      views: 8234810,
      category: "Fitness",
      published: "2021-08-01",
    },
    {
      title: "How to Cook the Perfect Steak",
      channel: "Tasty",
      views: 10234823,
      category: "Food",
      published: "2022-01-10",
    },
  ];
*/
  
document.getElementById("search-button").addEventListener("click", () => {
  const query = document.getElementById("search-input").value.toLowerCase();
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  /*
  // Filter top videos by title match
  const matches = videoDatabase.filter(video =>
    video.snippet.title.toLowerCase().includes(query)
  ).slice(0, 5); // limit to 5 results

  if (matches.length === 0) {
    resultsContainer.innerHTML = "<p>No matching videos found.</p>";
    return;
  }

  matches.forEach(video => {
    const videoElement = document.createElement("div");
    videoElement.innerHTML = `
      <p><strong>${video.snippet.title}</strong></p>
      <p>${video.snippet.channelTitle}</p>
      <p>${video.statistics.viewCount.toLocaleString()} views</p>
    `;
    resultsContainer.appendChild(videoElement);
  });
*/  

    //logic for hint box
    const userInput = document.getElementById("search-input").value.toLowerCase();
    const hintBox = document.getElementById("hint-output");

    const guessedVideo = topVideos.find((video) =>
        video.snippet.title.toLowerCase() === userInput
    );
    const guessViews = guessedVideo.statistics.viewCount;
    const guessTitle = guessedVideo.snippet.title.toLowerCase();
    const guessChannel = guessedVideo.snippet.channelTitle;
    const todayViews = todayVideo.statistics.viewCount;
    const todayTitle = todayVideo.snippet.title.toLowerCase();
    const todayChannel = todayVideo.snippet.channelTitle;

    console.log(`guessedVideo is ${guessedVideo}`);

    if(!guessedVideo) {
        hintBox.innerHTML = `<p> Video not found in our mock database, try again </p>`;
        return;
    }

    const hints = [];

    //Hint 1: View Count Difference
    const ViewDifference = todayViews - guessViews;
    if(ViewDifference > 0){
        hints.push(`^Your guess has ${guessViews}`);
    } else if (ViewDifference <0){
        hints.push(`Your guess has ${guessViews}`);
    }

    //Hint 2: Same Channel
    if (guessChannel === todayChannel){
        hints.push("✅ Same channel");
    } else{
        hints.push(`❌ Different channel (You guessed: ${guessChannel})`);
    }

    /*
    //Hint 3: Same Category
    if (guessedVideo.category === todayVideo.category) {
        hints.push("✅ Same category");
    } else{
        hints.push(`❌ Different category (You guessed: ${guessedVideo.category})`);
    }
        */

    //Hint 4: Publish Date
    const guessedDate = new Date(guessedVideo.snippet.publishedAt);
    const correctDate = new Date(todayVideo.snippet.publishedAt);

    if (guessedDate.getTime() === correctDate.getTime()){
        hints.push("✅ Published on the same day");
    } else if(guessedDate < correctDate){
        hints.push(`📅 Your guess, published on ${guessedDate} is older`);
    } else{
        hints.push(`📅 Your guess, published on ${guessedDate} is newer`);
    }

    //Display Hints
    hintBox.innerHTML = `
        <p><strong>Your Guess:</strong> ${guessTitle}</p>
        <ul>${hints.map((hint) => `<li>${hint}</li>`).join("")}</ul>
    `;
});