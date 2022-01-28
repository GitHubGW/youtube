const videoPlayer: HTMLDivElement | null = document.querySelector("#jsVideoPlayer");
const video: HTMLVideoElement | null = document.querySelector("video");
const playButton: HTMLSpanElement | null = document.querySelector("#jsPlayButton");
const volume: HTMLInputElement | null = document.querySelector("#jsVolume");
const volumeButton: HTMLSpanElement | null = document.querySelector("#jsVolumeButton");
const fullScreen: HTMLSpanElement | null = document.querySelector("#jsFullScreen");

let volumeValue: string | undefined = volume?.value;

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

playButton?.addEventListener("click", handlePlayButton);
volume?.addEventListener("input", handleVolume);
volumeButton?.addEventListener("click", handleVolumeButton);
fullScreen?.addEventListener("click", handleFullScreen);
