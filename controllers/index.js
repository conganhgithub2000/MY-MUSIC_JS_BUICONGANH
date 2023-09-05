const audioSong = document.querySelector("#song");
const imgMusic = document.querySelector("#img__music");
const playBtn = document.querySelector(".btn__play");
const prevBtn = document.querySelector(".play__back");
const nextBtn = document.querySelector(".play__forward");
const remainingTime = document.querySelector(".current-time");
const songDuration = document.querySelector(".song-duration");
const rangeBar = document.querySelector(".slider");
const randomBtn = document.querySelector(".btn__randomMusic");
const repeatBtn = document.querySelector(".btn__repeat");
const favouritesBtn = document.querySelector(".btn__favourites");
// const musicItem = document.querySelector(".music__item");

let isPlaying = true;
// let isListSong = false;
let isRandom = false;
let isRepeat = false;

playBtn.addEventListener("click", playPause);
//chức năng play , pause và thay đổi icon khi play , pause
function playPause() {
  if (isPlaying) {
    audioSong.play();
    playBtn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
    isPlaying = false;
  } else {
    audioSong.pause();
    playBtn.innerHTML = `<i class="fa-solid fa-circle-play"></i>`;
    isPlaying = true;
  }
}

// khi chuyển bài hát sẽ render song ra màn hình và play song
function nextPrevSong(indexSong) {
  let playHTML = "";
  playHTML += `
                <h6>Name : ${arrSong[indexSong].name}</h6>
                <p>Singer : ${arrSong[indexSong].singer}</p>
    `;
  document.querySelector("#titleNameSong").innerHTML = playHTML;

  imgMusic.setAttribute("src", arrSong[indexSong].image);
  audioSong.setAttribute("src", arrSong[indexSong].audio);

  //khi click vào bài hát thì nó sẻ tự động phát và đổi icon
  audioSong.play();
  playBtn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
  isPlaying = false;
}

//random bài hát
function randomMusic(indexSong) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * arrSong.length);
  } while (newIndex === indexSong);
  nextPrevSong(newIndex);
}

//hiển thị thông tin phần play : tên , ca sĩ, thay đổi link audio,link img
function RenderPlayMusic(indexMusic) {
  let indexSong = indexMusic;
  let playHTML = "";
  playHTML += `
                <h6>Name : ${arrSong[indexMusic].name}</h6>
                <p>Singer : ${arrSong[indexMusic].singer}</p>
    `;
  imgMusic.setAttribute("src", arrSong[indexMusic].image);
  audioSong.setAttribute("src", arrSong[indexMusic].audio);
  document.querySelector("#titleNameSong").innerHTML = playHTML;

  //khi click vào bài hát thì nó sẻ tự động phát và đổi icon
  audioSong.play();
  playBtn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
  isPlaying = false;

  // chuyển tới bài hát tiếp theo
  nextBtn.onclick = function () {
    if (isRandom) {
      randomMusic(indexSong);
    } else {
      indexSong >= arrSong.length ? (indexSong = 0) : indexSong++;
      nextPrevSong(indexSong);
    }
  };
  // trở lại bài hát trước đó
  prevBtn.onclick = function () {
    indexSong < 0 ? (indexSong = arrSong.length - 1) : indexSong--;
    if (isRandom) {
      randomMusic(indexSong);
    } else {
      nextPrevSong(indexSong);
    }
  };
  // khi kết thức 1 bài hát thì nó sẽ tự phát bài hát tiếp theo
  audioSong.onended = function () {
    if (isRepeat) {
      audioSong.play();
      playBtn.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
      isPlaying = false;
    } else {
      indexSong >= arrSong.length ? (indexSong = 0) : indexSong++;
      nextPrevSong(indexSong);
    }
  };
  //xử lý onclick random
  randomBtn.onclick = function () {
    isRandom = !isRandom;
    randomBtn.classList.toggle("active", isRandom);
  };
  //xử lý phát lại 1 bài hát
  repeatBtn.onclick = function () {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active", isRepeat);
  };
}

//hiển thị danh sách bài hát ra màng hình
function renderListMusic(arrMusic) {
  let outputHTML = "";
  for (let index = 0; index < arrMusic.length; index++) {
    let music = arrMusic[index];
    outputHTML += `
    <div class="music__item" onclick="RenderPlayMusic(${index})">
              <div class="music_item--left">
                <i class="ml-2 fa-solid fa-ellipsis-vertical"></i>
                <div class="music__item--text ml-2">
                  <h6 class="mb-0">${music.name}</h6>
                  <p class="mb-0">${music.singer}</p>
                </div>
              </div>
              <i class="ml-3 mr-2 icon__playList fa-regular fa-circle-play"></i>
            </div>
    `;
  }
  document.querySelector("#musicList").innerHTML = outputHTML;
}

//hiển thị thời gian của bài hát và thời gian đang chạy
function displayTimer() {
  //duration : lấy số time của bài hát
  //curentTime : lấy số thời gian đang chạy
  const { duration, currentTime } = audioSong;

  //dùng để hiển thị time khi đang play songs
  remainingTime.textContent = formatTime(currentTime);

  //cho input đó max bằng với thời gian bài hát
  //và cho nó chạy theo thời gian khi play
  rangeBar.max = duration;
  rangeBar.value = currentTime;

  if (!duration) {
    songDuration.textContent = "00:00";
  } else {
    songDuration.textContent = formatTime(duration);
  }
}

displayTimer();
//cho hàm này chạy liên tục
setInterval(displayTimer, 500);

//tính thời gian chuyển số giây sang phút
function formatTime(number) {
  const minutes = Math.floor(number / 60);
  const seconds = Math.floor(number - minutes * 60);
  //cho ra kết quả và format lại textContent nhìn cho ok
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}

//cho thanh input chạy theo thời gian play songs
rangeBar.addEventListener("change", handleChangeBar);
function handleChangeBar() {
  audioSong.currentTime = rangeBar.value;
}

window.onload = function () {
  RenderPlayMusic(0);
  playPause();
  renderListMusic(arrSong);
};
