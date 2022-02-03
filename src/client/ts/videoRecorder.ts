import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";

const recorderContainer: HTMLDivElement | null = document.querySelector("#jsRecorderContainer");
const videoPreview: HTMLVideoElement | null = document.querySelector("#jsVideoPreview");
const recordButton: HTMLButtonElement | null = document.querySelector("#jsRecordButton");
let mediaStream: MediaStream;
let mediaRecorder: MediaRecorder;
let videoObjectUrl: string;

const handleStartPreview = async (): Promise<void> => {
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1024, height: 576 } });

  if (videoPreview && recordButton) {
    videoPreview.srcObject = mediaStream;
    await videoPreview.play();
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
    recordButton.innerText = "녹화 중지";
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
    recordButton.addEventListener("click", handleTranscodeToMp4);
    mediaRecorder.stop();
  }
};

const handleTranscodeToMp4 = async (): Promise<void> => {
  const ffmpeg: FFmpeg = createFFmpeg({ corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js", log: true });
  await ffmpeg.load();
  const uint8Url: Uint8Array = await fetchFile(videoObjectUrl);
  ffmpeg.FS("writeFile", "video.webm", uint8Url);
  await ffmpeg.run("-i", "video.webm", "video.mp4");
  const uint8Video: Uint8Array = ffmpeg.FS("readFile", "video.mp4");
  console.log("uint8Video", uint8Video);
  console.log("uint8Video.buffer", uint8Video.buffer);
  const videoMp4Blob: Blob = new Blob([uint8Video.buffer], { type: "video/mp4" });
  const videoMp4ObjectUrl: string = URL.createObjectURL(videoMp4Blob);
  handleDownloadRecording(videoMp4ObjectUrl);
};

const handleDownloadRecording = (videoMp4ObjectUrl: string): void => {
  const a: HTMLAnchorElement = document.createElement("a");
  a.href = videoMp4ObjectUrl;
  a.download = `${Date.now()}.mp4`;
  a.click();

  if (recordButton) {
    recordButton.innerText = "녹화 시작";
  }
};

handleStartPreview();
recordButton?.addEventListener("click", handleStartRecording);
