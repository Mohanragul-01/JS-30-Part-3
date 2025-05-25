const speed = document.querySelector(".speed");
const speedBar = document.querySelector(".speed-bar");
const video = document.querySelector("video");
function handleSpeedChange(e) {
  const isSmallDevice = window.innerWidth <= 768;
  let percent;
  if (isSmallDevice) {
    const x = e.pageX - this.offsetLeft;
    percent = x / this.offsetWidth;
  } else {
    const y = e.pageY - this.offsetTop;
    percent = y / this.offsetHeight;
  }
  const min = 0.4;
  const max = 4;
  const size = Math.round(percent * 100) + "%";
  const playbackRate = percent * (max - min) + min;
  if (isSmallDevice) {
    speedBar.style.width = size;
  } else {
    speedBar.style.height = size;
  }
  speedBar.textContent = playbackRate.toFixed(2) + "x";
  video.playbackRate = playbackRate;
}
speed.addEventListener("mousemove", handleSpeedChange);
