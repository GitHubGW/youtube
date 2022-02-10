const videoElement: HTMLVideoElement | null = document.querySelector("video");
const commentForm: HTMLFormElement | null = document.querySelector("#jsCommentForm");
const commentInput: HTMLInputElement | null = document.querySelector("#jsCommentInput");
const commentUl: HTMLUListElement | null = document.querySelector("#jsCommentUl");
const commentLis: NodeListOf<HTMLLIElement> = document.querySelectorAll("#jsCommentLi");
const commentLisArray: HTMLLIElement[] = Array.from(commentLis);
const commentNumber: HTMLSpanElement | null = document.querySelector("#jsCommentNumber");

const handleCreateCommentForm = (loggedInUser: any, commentId: string, commentInputValue: string): void => {
  const li: HTMLLIElement = document.createElement("li");
  const commentImage: HTMLDivElement = document.createElement("div");
  const commentImageChild: HTMLImageElement = document.createElement("img");
  const commentContent: HTMLDivElement = document.createElement("div");
  const commentAuthor: HTMLDivElement = document.createElement("div");
  const commentAuthorFirstSpan: HTMLSpanElement = document.createElement("span");
  const commentAuthorSecondSpan: HTMLSpanElement = document.createElement("span");
  const commentDescription: HTMLDivElement = document.createElement("div");
  const commentDelete: HTMLButtonElement = document.createElement("button");
  const commentFontAwesome: HTMLElement = document.createElement("i");

  commentImage.classList.add("comment__image");
  commentContent.classList.add("comment__content");
  commentAuthor.classList.add("comment__author");
  commentDescription.classList.add("comment__description");
  commentDelete.classList.add("comment__delete");
  commentFontAwesome.classList.add("fas");
  commentFontAwesome.classList.add("fa-times-circle");
  commentDelete.addEventListener("click", () => handleDeleteComment(li, commentId));
  if (commentNumber) {
    commentNumber.innerText = String(Number(commentNumber.innerText) + 1);
  }

  li.appendChild(commentImage);
  li.appendChild(commentContent);
  commentImage.appendChild(commentImageChild);
  commentContent.appendChild(commentAuthor);
  commentContent.appendChild(commentDescription);
  commentAuthor.appendChild(commentAuthorFirstSpan);
  commentAuthor.appendChild(commentAuthorSecondSpan);
  commentAuthor.appendChild(commentDelete);
  commentDelete.appendChild(commentFontAwesome);

  const currentDate: string = new Date().toLocaleDateString("ko-KR");
  commentImageChild.src = loggedInUser.avatarUrl ? `${loggedInUser.avatarUrl}` : "/images/default_user.png";
  commentAuthorFirstSpan.innerText = loggedInUser.username;
  commentAuthorSecondSpan.innerText = currentDate;
  commentDescription.innerText = commentInputValue;
  li.dataset.id = commentId;
  commentUl?.prepend(li);
};

const handleCreateComment = async (event: any): Promise<void> => {
  event.preventDefault();

  try {
    if (commentInput) {
      const videoId: string | undefined = videoElement?.dataset.videoId;
      const commentInputValue: string = commentInput.value;
      commentInput.value = "";

      if (commentInputValue !== "") {
        const response: Response = await fetch(`/api/videos/${videoId}/comment`, {
          method: "POST",
          body: JSON.stringify({ text: commentInputValue }),
          headers: { "Content-type": "application/json" },
        });

        if (response.status === 201) {
          const { loggedInUser, commentId } = await response.json();
          handleCreateCommentForm(loggedInUser, commentId, commentInputValue);
        } else if (response.status === 404) {
          throw new Error();
        }
      }
    }
  } catch (error) {
    console.log("handleCreateComment error");
  }
};

const handleDeleteComment = async (commentLi: HTMLLIElement, commentId: string): Promise<void> => {
  try {
    const videoId: string | undefined = videoElement?.dataset.videoId;
    const response: Response = await fetch(`/api/videos/${videoId}/comment/${commentId}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      if (commentNumber) {
        commentNumber.innerText = String(Number(commentNumber.innerText) - 1);
      }
      commentLi.remove();
    } else if (response.status === 404) {
      throw new Error();
    }
  } catch (error) {
    console.log("handleDeleteComment error");
  }
};

commentForm?.addEventListener("submit", handleCreateComment);
commentLisArray.map((commentLi: HTMLLIElement) => {
  const deleteCommentButton: HTMLButtonElement | null = commentLi.querySelector("#jsDeleteCommentButton");
  const commentId: string = commentLi.dataset.id as string;
  deleteCommentButton?.addEventListener("click", () => handleDeleteComment(commentLi, commentId));
});
