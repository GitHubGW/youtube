import { Request, Response } from "express";

const sampleVideo = [
  {
    id: 1,
    title: "video1",
    content: "This is video1",
    rating: 10,
    comments: 5,
    views: 20,
    createdAt: "10 mins ago",
  },
  {
    id: 2,
    title: "video2",
    content: "This is video2",
    rating: 20,
    comments: 2,
    views: 10,
    createdAt: "15 mins ago",
  },
  {
    id: 3,
    title: "video3",
    content: "This is video3",
    rating: 30,
    comments: 3,
    views: 15,
    createdAt: "22 mins ago",
  },
];

interface Video {
  id: number;
  title: string;
  content: string;
  rating: number;
  comments: number;
  views: number;
  createdAt: string;
}

export const handleSeeVideo = (req: Request, res: Response): void => {
  const {
    params: { id },
  } = req;
  const foundVideo: Video | undefined = sampleVideo.find((video) => video.id === +id);

  return res.render("videos/seeVideo", { pageTitle: `${foundVideo?.title}`, video: foundVideo });
};

export const handleGetEditVideo = (req: Request, res: Response): void => {
  const {
    params: { id },
  } = req;
  const foundVideo: Video | undefined = sampleVideo.find((video) => video.id === +id);

  return res.render("videos/editVideo", { pageTitle: `${foundVideo?.title} 수정`, video: foundVideo });
};

export const handlePostEditVideo = (req: Request, res: Response): void => {
  const {
    params: { id },
    body: { title },
  } = req;
  const foundVideo: Video | undefined = sampleVideo.find((video) => video.id === +id);

  if (foundVideo) {
    foundVideo.title = title;
  }

  return res.redirect(`/videos/${id}`);
};

export const handleGetUploadVideo = (req: Request, res: Response): void => {
  return res.render("videos/uploadVideo", { pageTitle: "비디오 업로드" });
};

export const handlePostUploadVideo = (req: Request, res: Response): void => {
  const {
    body: { title },
  } = req;

  const newVideo = {
    id: sampleVideo.length + 1,
    title,
    content: `This is video${sampleVideo.length + 1}`,
    rating: 10,
    comments: 5,
    views: 20,
    createdAt: "10 mins ago",
  };

  sampleVideo.push(newVideo);

  return res.redirect("/");
};

export const handleDeleteVideo = (req: Request, res: Response) => {
  return res.send("handleDeleteVideo");
};
