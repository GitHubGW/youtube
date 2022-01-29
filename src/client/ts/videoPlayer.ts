const videoPlayer: HTMLDivElement | null = document.querySelector("#jsVideoPlayer");
const video: HTMLVideoElement | null = document.querySelector("video");
const playButton: HTMLSpanElement | null = document.querySelector("#jsPlayButton");
const volume: HTMLInputElement | null = document.querySelector("#jsVolume");
const volumeButton: HTMLSpanElement | null = document.querySelector("#jsVolumeButton");
const fullScreen: HTMLSpanElement | null = document.querySelector("#jsFullScreen");
const videoCurrentTime: HTMLSpanElement | null = document.querySelector("#jsVideoCurrentTime");
const videoDuration: HTMLSpanElement | null = document.querySelector("#jsVideoDuration");
const videoTimeline: HTMLInputElement | null = document.querySelector("#jsVideoTimeline");

let volumeValue: string | undefined = volume?.value;

const handleSetDuration = (): void => {
  if (video && videoDuration && videoTimeline) {
    const duration: number = Math.ceil(video.duration);
    const parsedDuration: string = new Date(duration * 1000).toTimeString().substring(3, 8);
    videoDuration.innerText = parsedDuration;
    videoTimeline.max = String(duration);
  }
};

const handleSetCurrentTime = (): void => {
  if (video && videoCurrentTime && videoTimeline) {
    if (video.ended === true && playButton && videoTimeline) {
      playButton.innerHTML = `<i class="fas fa-play"></i>`;
      video.currentTime = 0;
      videoTimeline.value = String(0);
    }
    const currentTime: number = Math.ceil(video.currentTime);
    const parsedCurrentTime: string = new Date(currentTime * 1000).toTimeString().substring(3, 8);
    videoCurrentTime.innerText = parsedCurrentTime;
    videoTimeline.value = String(currentTime);
  }
};

const handlePlayVideo = async (): Promise<void> => {
  if (video && playButton) {
    if (video.paused === true) {
      playButton.innerHTML = `<i class="fas fa-pause"></i>`;
      await video.play();
    } else if (video.paused === false) {
      playButton.innerHTML = `<i class="fas fa-play"></i>`;
      await video.pause();
    }
  }
};

const handleSetVolume = (): void => {
  if (video && volume && volumeButton) {
    if (volume.value === "0") {
      volumeButton.innerHTML = `<i class="fas fa-volume-mute"></i>`;
    } else if (volume.value > "0") {
      volumeButton.innerHTML = `<i class="fas fa-volume-up"></i>`;
    }
    video.volume = +volume.value;
    volumeValue = volume.value;
  }
};

const handleMuteVolume = (): void => {
  if (video && volume && volumeButton) {
    if (video.muted === true) {
      volumeButton.innerHTML = `<i class="fas fa-volume-up"></i>`;
      video.muted = false;
      volume.value = String(volumeValue);
    } else if (video.muted === false) {
      volumeButton.innerHTML = `<i class="fas fa-volume-mute"></i>`;
      video.muted = true;
      volume.value = String(0);
    }
  }
};

const handleSetTimeline = (event: any): void => {
  if (video) {
    video.currentTime = +event.target.value;
  }
};

const handleFullScreen = (): void => {};

const handlePressSpace = (event: any): void => {
  if (event.code === "Space") {
    handlePlayVideo();
  }
};

video?.addEventListener("canplay", handleSetDuration);
video?.addEventListener("timeupdate", handleSetCurrentTime);
video?.addEventListener("click", handlePlayVideo);
playButton?.addEventListener("click", handlePlayVideo);
volume?.addEventListener("input", handleSetVolume);
volumeButton?.addEventListener("click", handleMuteVolume);
videoTimeline?.addEventListener("input", handleSetTimeline);
fullScreen?.addEventListener("click", handleFullScreen);
window.addEventListener("keypress", handlePressSpace);
