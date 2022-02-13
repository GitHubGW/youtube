const hashtags: NodeListOf<HTMLSpanElement> = document.querySelectorAll("#jsHashtag");

const handleHashtag = (event: any): void => {
  const text: string = event.target.innerText;
  const replacedText: string = text.replaceAll("#", "");
  window.location.href = `/search?title=${replacedText}`;
};

hashtags.forEach((hashtag: HTMLSpanElement) => {
  hashtag?.addEventListener("click", handleHashtag);
});
