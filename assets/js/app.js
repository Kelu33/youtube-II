const container = document.querySelector("main");

fetch("data.json")
  .then((response) => response.json())
  .then((videoDataList) => {
    videoDataList = shuffleArray(videoDataList);
    let video;
    for (let videoData of videoDataList) {
      video = new Video(
        videoData.src,
        videoData.title,
        videoData.thumbnail,
        videoData.account,
        videoData.info
      );
      video.display(container);
    }
  })
  .catch((error) => console.log(error));

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
