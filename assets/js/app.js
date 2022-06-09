const container = document.querySelector("main");

fetch("data.json")
  .then((response) => response.json())
  .then((videoDataList) => {
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
