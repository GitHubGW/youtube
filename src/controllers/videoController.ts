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

interface IVideo {
  id: number;
  title: string;
  content: string;
  rating: number;
  comments: number;
  views: number;
  createdAt: string;
}

export const handleSeeVideo = (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  const foundVideo: IVideo | undefined = sampleVideo.find((video) => video.id === +id);

  return res.render("videos/seeVideo", { pageTitle: `${foundVideo?.title}`, video: foundVideo });
};

export const handleEditVideo = (req: Request, res: Response) => {
  return res.send("handleEditVideo");
};

export const handleDeleteVideo = (req: Request, res: Response) => {
  return res.send("handleDeleteVideo");
};

export const handleUploadVideo = (req: Request, res: Response) => {
  return res.send("handleUploadVideo");
};
