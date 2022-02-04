import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";

const recorderContainer: HTMLDivElement | null = document.querySelector("#jsRecorderContainer");
const videoPreview: HTMLVideoElement | null = document.querySelector("#jsVideoPreview");
const recordButton: HTMLButtonElement | null = document.querySelector("#jsRecordButton");
let mediaStream: MediaStream;
let mediaRecorder: MediaRecorder;
let videoObjectUrl: string;

const handleStartPreview = async (): Promise<void> => {
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1024, height: 768 } });

  if (videoPreview && recordButton) {
    videoPreview.srcObject = mediaStream;
    await videoPreview.play();
    recordButton.disabled = false;
    recordButton.innerText = "녹화 시작";
  }
};

const handleShowRecording = async (event: BlobEvent): Promise<void> => {
  const videoBlob: Blob = event.data;
  videoObjectUrl = URL.createObjectURL(videoBlob);

  if (videoPreview) {
    videoPreview.srcObject = null;
    videoPreview.src = videoObjectUrl;
    videoPreview.loop = true;
    await videoPreview.play();
  }
};

const handleStartRecording = (): void => {
  if (recordButton && mediaStream) {
    recordButton.innerText = "녹화 정지";
    recordButton.removeEventListener("click", handleStartRecording);
    recordButton.addEventListener("click", handleStopRecording);
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.start();
    mediaRecorder.addEventListener("dataavailable", handleShowRecording);
  }
};

const handleStopRecording = (): void => {
  if (recordButton) {
    recordButton.innerText = "녹화 다운로드";
    recordButton.removeEventListener("click", handleStopRecording);
    recordButton.addEventListener("click", handleExtractUrlFromRecording);
    mediaRecorder.stop();
  }
};

const handleExtractUrlFromRecording = async (): Promise<void> => {
  try {
    if (recordButton) {
      recordButton.disabled = true;
      recordButton.innerText = "비디오 파일 추출중...";
    }

    const ffmpeg: FFmpeg = createFFmpeg({ corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js", log: true });
    await ffmpeg.load();
    const uint8ArrayData = await fetchFile(videoObjectUrl);
    ffmpeg.FS("writeFile", "video.webm", uint8ArrayData);
    await ffmpeg.run("-i", "video.webm", "video.mp4");
    await ffmpeg.run("-i", "video.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg");

    const uint8Video: Uint8Array = ffmpeg.FS("readFile", "video.mp4");
    const uint8Thumbnail: Uint8Array = ffmpeg.FS("readFile", "thumbnail.jpg");
    const videoMp4Blob: Blob = new Blob([uint8Video.buffer], { type: "video/mp4" });
    const thumbnailBlob: Blob = new Blob([uint8Thumbnail.buffer], { type: "image/jpg" });
    const videoMp4ObjectUrl: string = URL.createObjectURL(videoMp4Blob);
    const thumbnailObjectUrl: string = URL.createObjectURL(thumbnailBlob);
    handleDownloadRecording(videoMp4ObjectUrl, thumbnailObjectUrl);

    ffmpeg.FS("unlink", "video.webm");
    ffmpeg.FS("unlink", "video.mp4");
    ffmpeg.FS("unlink", "thumbnail.jpg");
  } catch (error) {
    console.log("handleExtractFromRecording error");
  }
};

const handleDownloadRecording = (videoMp4ObjectUrl: string, thumbnailObjectUrl: string): void => {
  const a: HTMLAnchorElement = document.createElement("a");
  a.href = videoMp4ObjectUrl;
  a.download = "video.mp4";
  a.click();
  a.href = thumbnailObjectUrl;
  a.download = "thumbnail.jpg";
  a.click();

  URL.revokeObjectURL(videoObjectUrl);
  URL.revokeObjectURL(videoMp4ObjectUrl);
  URL.revokeObjectURL(thumbnailObjectUrl);

  if (recordButton) {
    recordButton.disabled = false;
    recordButton.innerText = "녹화 시작";
    recordButton.removeEventListener("click", handleExtractUrlFromRecording);
    recordButton.addEventListener("click", handleStartRecording);
  }
};

handleStartPreview();
recordButton?.addEventListener("click", handleStartRecording);
