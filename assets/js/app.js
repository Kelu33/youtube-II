const container = document.querySelector("main");
const form = document.querySelector('form');

let filter;
let href = window.location.href.split('?');
if (href.length > 1) filter = href[1].split('=')[1].toLowerCase();

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
        videoData.info
      );
      videoList.push(video);      
    }
    
    if (filter) {
      videoList = titleFilter(videoList, filter);
    }    
    for (let filtredVid of videoList) {
      filtredVid.display(container);
    }
    
    form.addEventListener('input', (e) => {
      e.preventDefault();

      let wrapList = document.querySelectorAll('.video-wrap');
      for (let wrap of wrapList) {
        container.removeChild(wrap);
      }

      let query = e.target.value.toLowerCase();
      let filtredVidz = titleFilter(videoList, query);      

      for (let video of filtredVidz) {
        video.display(container);
      }
    })
  })
  .catch((error) => console.log(error));

function titleFilter(array, filter) {
  return array.filter(video => video.title.toLowerCase().includes(filter));
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
