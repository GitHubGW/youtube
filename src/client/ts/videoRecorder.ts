const recorderContainer: HTMLDivElement | null = document.querySelector("#jsRecorderContainer");
const videoPreview: HTMLVideoElement | null = document.querySelector("#jsVideoPreview");
const recordButton: HTMLButtonElement | null = document.querySelector("#jsRecordButton");

let mediaStream: MediaStream;
let mediaRecorder: MediaRecorder;
let objectURL: string;

const handleStartPreview = async (): Promise<void> => {
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1024, height: 576 } });

  if (videoPreview) {
    videoPreview.srcObject = mediaStream;
    await videoPreview.play();
  }
};

const handleShowRecording = async (event: BlobEvent): Promise<void> => {
  const blob: Blob = event.data;
  objectURL = URL.createObjectURL(blob);

  if (videoPreview) {
    videoPreview.srcObject = null;
    videoPreview.src = objectURL;
    videoPreview.loop = true;
    await videoPreview.play();
  }
};

const handleStartRecording = (): void => {
  if (recordButton && mediaStream) {
    recordButton.innerText = "녹화 중지";
    recordButton.removeEventListener("click", handleStartRecording);
    recordButton.addEventListener("click", handleStopRecording);
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "video/webm" });
    mediaRecorder.start();
    mediaRecorder.addEventListener("dataavailable", handleShowRecording);
  }
};

const handleStopRecording = (): void => {
  if (recordButton) {
    recordButton.innerText = "녹화 다운로드";
    recordButton.removeEventListener("click", handleStopRecording);
    recordButton.addEventListener("click", handleDownloadRecording);
    mediaRecorder.stop();
  }
};

const handleDownloadRecording = (): void => {
  const a: HTMLAnchorElement = document.createElement("a");
  a.href = objectURL;
  a.download = `${Date.now()}.mp4`;
  a.click();
};

handleStartPreview();
recordButton?.addEventListener("click", handleStartRecording);
