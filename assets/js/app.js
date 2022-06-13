const container = document.querySelector("main");
const form = document.querySelector("form");
const categoryNav = document.querySelector("#category");
const suggestionBox = document.querySelector("#suggest");
const submitButton = document.querySelector("#search");

let oldQuery = localStorage.getItem("oldQuery");
if (oldQuery) oldQuery = oldQuery.split(",");
else oldQuery = [];

let filter;
let href = window.location.href.split("?");
if (href.length > 1)
  filter = href[1].split("=")[1].split("+").join(" ").toLowerCase();

fetch("data.json")
  .then((response) => response.json())
  .then((videoDataList) => {
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
    if (filter) {
      videoList = titleFilter(videoList, filter);
    }
    appendVidz(videoList, container);

    categoryNav.addEventListener("click", (e) => {
      e.preventDefault();
      removeVidz();
      let filteredVidz = categoryFilter(videoList, e.target.innerText);
      appendVidz(filteredVidz, container);
    });

    form.addEventListener("input", (e) => {
      e.preventDefault();

      removeVidz();
      let query = e.target.value.toLowerCase();
      let filteredVidz = titleFilter(videoList, query);

      matchingOldQuery = oldQuery.filter((old) =>
        old.toLowerCase().includes(query)
      );

      let suggestionLink = document.querySelectorAll(".suggestion-link");

      for (let link of suggestionLink) {
        suggestionBox.removeChild(link);
      }

      if (query) {
        matchingOldQuery = matchingOldQuery.reverse();
        for (let query of matchingOldQuery) {
          let suggestion;
          suggestion = document.createElement("a");
          suggestion.classList.add("suggestion-link");
          suggestion.innerHTML = query;
          suggestion.href = "http://localhost/youtube-II/?query=" + query;
          suggestionBox.append(suggestion);
        }
      }

      appendVidz(filteredVidz, container);
    });

    submitButton.addEventListener("click", (e) => {
      e.preventDefault();

      console.log(oldQuery);

      oldQuery = oldQuery.filter((old) => old !== query.value);
      oldQuery += "," + query.value;
      if (oldQuery.charAt(0) === ",") oldQuery = oldQuery.substring(1);
      localStorage.setItem("oldQuery", oldQuery);
      form.submit();
    });
  })
  .catch((error) => console.log(error));

function appendVidz(videoList, target) {
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
