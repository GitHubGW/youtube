const thumbnailVideo: HTMLVideoElement | null = document.querySelector("#jsThumbnailVideo");

const handleMouseoverVideo = async (): Promise<void> => {
  await thumbnailVideo?.play();
};

const handleMouseoutVideo = (): void => {
  thumbnailVideo?.load();
};

thumbnailVideo?.addEventListener("mouseover", handleMouseoverVideo);
thumbnailVideo?.addEventListener("mouseout", handleMouseoutVideo);
