const container = document.querySelector("main");
const form = document.querySelector("form");
const searchBar = document.querySelector("#query");
const categoryNav = document.querySelector("#category");
const suggestionBox = document.querySelector("#suggest");
const submitButton = document.querySelector("#search");
const noVidzMessage = document.querySelector("#error-message");     

// oldQueries are stored in localstorage
let oldQueries = localStorage.getItem("oldQueries");
if (oldQueries) oldQueries = oldQueries.split(",");
else oldQueries = [];

fetch("data.json")
  .then((response) => response.json())
  .then((videoDataList) => {
    // Instantiate Video objects with data.json content. Simulate api response
    videoDataList = shuffleArray(videoDataList);
    let videoList = [];
    let video;
    for (let videoData of videoDataList) {
      video = new Video(
        videoData.src,
        videoData.title,
        videoData.thumbnail,
        videoData.account,
        videoData.info,
        videoData.category
      );
      videoList.push(video);
    }    

    // filter is the url parameter named query
    let filter;
    let href = window.location.href.split("?");
    if (href.length > 1) {
      filter = href[1].split("=")[1].toLowerCase();
      filter = decodeURI(filter);
    }
    if (filter) {
      videoList = titleFilter(videoList, filter);
    }
    appendVidz(videoList, container);

    // Apply Filter base on category buttons 
    categoryNav.addEventListener("click", (e) => {
      e.preventDefault();
      removeVidz();
      let filteredVidz = categoryFilter(videoList, e.target.innerText);
      appendVidz(filteredVidz, container);
    });

    form.addEventListener("input", (e) => {
      e.preventDefault();
      removeVidz();

      // Sort vidz based on search bar value on input
      let query = e.target.value.toLowerCase();
      let filteredVidz = titleFilter(videoList, query); 

      matchingOldQueries = oldQueries.filter((old) =>
        old.toLowerCase().includes(query)
      );
      
      let suggestionLink = document.querySelectorAll(".suggestion-link");
      for (let link of suggestionLink) {
        suggestionBox.removeChild(link);
      }      

      if (query) {
        // Setting url parameter query to filter videos
        matchingOldQueries = matchingOldQueries.reverse();
        for (let query of matchingOldQueries) {
          let suggestion;
          suggestion = document.createElement("a");
          suggestion.classList.add("suggestion-link");
          suggestion.innerHTML = query;
          suggestion.href = "http://localhost/youtube-II/?query=" + query;
          suggestionBox.append(suggestion);
        }
      }
      appendVidz(filteredVidz, container);

      // Handle suggestion selection with key press
      let target = 0;
      document.body.onkeydown = (e) => {
        e = e || window.event;
        if (e.keyCode == "40" || e.keyCode == "38") {
          e.preventDefault();
          suggestionLink = document.querySelectorAll(".suggestion-link");
          if (e.keyCode == "40" && target < suggestionLink.length) {
            target++;
          } else if (e.keyCode == "38" && target > 0) {
            target--;
          }
          if (target === 0) {
            searchBar.focus();
            searchBar.value = query;
          } else {
            suggestionLink[target - 1].focus();
            searchBar.value = suggestionLink[target - 1].innerHTML;
          }
        }
      };
    });

    // Store previous queries in local storage
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      oldQueries = oldQueries.filter((old) => old !== query.value);
      oldQueries += "," + query.value;
      if (oldQueries.charAt(0) === ",") oldQueries = oldQueries.substring(1);
      localStorage.setItem("oldQueries", oldQueries);
      form.submit();
    });
  })
  .catch((error) => console.log(error));

function appendVidz(videoList, target) {
  if (videoList.length === 0) {
    noVidzMessage.style.display = "unset";
    noVidzMessage.innerHTML = `There's no video with ${query.value} in the title`;
    return;
  }
  noVidzMessage.style.display = "none";
  for (let video of videoList) {
    video.display(target);
  }
}

function removeVidz() {
  let wrapList = document.querySelectorAll(".video-wrap");
  for (let wrap of wrapList) {
    container.removeChild(wrap);
  }
}

function titleFilter(array, filter) {
  return array.filter((video) => video.title.toLowerCase().includes(filter));
}

function categoryFilter(array, category) {
  return array.filter((video) => video.category === category);
}

function shuffleArray(array) {
  let shuffled = [];
  for (let element of array) {
    shuffled.splice(getRandomArbitrary(0, shuffled.length + 1), 0, element);
  }
  return shuffled;
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
