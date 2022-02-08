const videoElement: HTMLVideoElement | null = document.querySelector("video");
const commentForm: HTMLFormElement | null = document.querySelector("#jsCommentForm");
const commentInput: HTMLInputElement | null = document.querySelector("#jsCommentInput");
const commentList: HTMLUListElement | null = document.querySelector("#jsCommentList");

const handleCreateComment = async (event: any) => {
  event.preventDefault();

  try {
    if (commentInput) {
      const videoId: string | undefined = videoElement?.dataset.videoId;
      const commentInputValue: string = commentInput.value;
      commentInput.value = "";

      if (commentInputValue !== "") {
        await fetch(`/api/videos/${videoId}/comment`, {
          method: "POST",
          body: JSON.stringify({ text: commentInputValue }),
          headers: { "Content-type": "application/json" },
        });

        window.location.reload();
      }
    }
  } catch (error) {
    console.log("handleCreateComment error");
  }
};

commentForm?.addEventListener("submit", handleCreateComment);
