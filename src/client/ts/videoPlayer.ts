const videoPlayer: Element | null = document.querySelector("#jsVideoPlayer");
const video: HTMLVideoElement | null = document.querySelector("video");
const playButton: Element | null = document.querySelector("#jsPlayButton");
const volume: Element | null = document.querySelector("#jsVolume");
const volumeButton: Element | null = document.querySelector("#jsVolumeButton");
const fullScreen: Element | null = document.querySelector("#jsFullScreen");

const handlePlayButton = async (): Promise<void> => {
  if (video?.paused === true && playButton) {
    playButton.innerHTML = `<i class="fas fa-pause"></i>`;
    await video.play();
  } else if (video?.paused === false && playButton) {
    playButton.innerHTML = `<i class="fas fa-play"></i>`;
    await video.pause();
  }
};

const handleVolume = (): void => {};

const handleVolumeButton = (): void => {};

const handleFullScreen = (): void => {};

playButton?.addEventListener("click", handlePlayButton);
volume?.addEventListener("click", handleVolume);
volumeButton?.addEventListener("click", handleVolumeButton);
fullScreen?.addEventListener("click", handleFullScreen);
