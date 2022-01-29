const videoPlayer: HTMLDivElement | null = document.querySelector("#jsVideoPlayer");
const video: HTMLVideoElement | null = document.querySelector("video");
const playButton: HTMLSpanElement | null = document.querySelector("#jsPlayButton");
const volume: HTMLInputElement | null = document.querySelector("#jsVolume");
const volumeButton: HTMLSpanElement | null = document.querySelector("#jsVolumeButton");
const fullScreen: HTMLSpanElement | null = document.querySelector("#jsFullScreen");
const videoCurrentTime: HTMLSpanElement | null = document.querySelector("#jsVideoCurrentTime");
const videoDuration: HTMLSpanElement | null = document.querySelector("#jsVideoDuration");

let volumeValue: string | undefined = volume?.value;

const handleVideoTime = () => {
  if (video && videoDuration) {
    const duration: number = Math.ceil(video.duration);
    const parsedDuration: string = new Date(duration * 1000).toTimeString().substring(3, 8);
    videoDuration.innerText = parsedDuration;
  }
};

const handleTimeUpdate = () => {
  if (video && videoCurrentTime) {
    const currentTime: number = Math.ceil(video.currentTime);
    const parsedCurrentTime: string = new Date(currentTime * 1000).toTimeString().substring(3, 8);
    videoCurrentTime.innerText = parsedCurrentTime;
  }
};

const handlePlayButton = async (): Promise<void> => {
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

const handleVolume = (): void => {
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

const handleVolumeButton = (): void => {
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

const handleFullScreen = (): void => {};

video?.addEventListener("canplay", handleVideoTime);
video?.addEventListener("timeupdate", handleTimeUpdate);
playButton?.addEventListener("click", handlePlayButton);
volume?.addEventListener("input", handleVolume);
volumeButton?.addEventListener("click", handleVolumeButton);
fullScreen?.addEventListener("click", handleFullScreen);
