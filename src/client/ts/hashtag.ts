const hashtags: NodeListOf<HTMLSpanElement> = document.querySelectorAll("#jsHashtag");

const handleHashtag = (event: MouseEvent): void => {
  const text: string = (event.target as HTMLInputElement).innerText;
  const replacedText: string = text.replaceAll("#", "");
  window.location.href = `/search?title=${replacedText}`;
};

hashtags.forEach((hashtag: HTMLSpanElement) => {
  hashtag?.addEventListener("click", handleHashtag);
});
