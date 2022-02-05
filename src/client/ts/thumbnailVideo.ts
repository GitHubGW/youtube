const thumbnailVideos: NodeListOf<HTMLVideoElement> = document.querySelectorAll("#jsThumbnailVideo");

thumbnailVideos.forEach((thumbnailVideo: HTMLVideoElement) => {
  thumbnailVideo.addEventListener("mouseover", (): Promise<void> => {
    return thumbnailVideo.play();
  });

  thumbnailVideo.addEventListener("mouseout", (): void => {
    return thumbnailVideo.load();
  });
});
