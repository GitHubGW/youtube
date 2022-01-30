const videoPlayer: HTMLDivElement | null = document.querySelector("#jsVideoPlayer");
const video: HTMLVideoElement | null = document.querySelector("video");
const playButton: HTMLSpanElement | null = document.querySelector("#jsPlayButton");
const volume: HTMLInputElement | null = document.querySelector("#jsVolume");
const volumeButton: HTMLSpanElement | null = document.querySelector("#jsVolumeButton");
const fullScreenButton: HTMLSpanElement | null = document.querySelector("#jsFullScreenButton");
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

const handleChangeFullScreen = async (): Promise<void> => {
  if (fullScreenButton) {
    const fullscreenElement: Element | null = document.fullscreenElement;
    if (fullscreenElement === null) {
      await videoPlayer?.requestFullscreen();
      fullScreenButton.innerHTML = `<i class="fas fa-compress"></i>`;
    } else if (fullscreenElement !== null) {
      await document.exitFullscreen();
      fullScreenButton.innerHTML = `<i class="fas fa-expand"></i>`;
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

const handleSetTimeline = (event: any): void => {
  if (video) {
    video.currentTime = +event.target.value;
  }
};

const handlePressSpace = async (event: any): Promise<void> => {
  if (event.code === "Space") {
    await handlePlayVideo();
  }
};

video?.addEventListener("canplay", handleSetDuration);
video?.addEventListener("timeupdate", handleSetCurrentTime);
video?.addEventListener("click", handlePlayVideo);
playButton?.addEventListener("click", handlePlayVideo);
volumeButton?.addEventListener("click", handleMuteVolume);
fullScreenButton?.addEventListener("click", handleChangeFullScreen);
volume?.addEventListener("input", handleSetVolume);
videoTimeline?.addEventListener("input", handleSetTimeline);
window.addEventListener("keypress", handlePressSpace);
