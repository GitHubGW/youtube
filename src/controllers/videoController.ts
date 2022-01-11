import { Request, Response } from "express";
import Video from "../models/Video";

export const handleSeeVideo = (req: Request, res: Response): void => {
  const {
    params: { id },
  } = req;

  return res.render("videos/seeVideo", { pageTitle: "" });
};

export const handleGetEditVideo = (req: Request, res: Response): void => {
  const {
    params: { id },
  } = req;

  return res.render("videos/editVideo", { pageTitle: "" });
};

export const handlePostEditVideo = (req: Request, res: Response): void => {
  const {
    params: { id },
    body: { title },
  } = req;

  return res.redirect(`/videos/${id}`);
};

export const handleGetUploadVideo = (req: Request, res: Response): void => {
  return res.render("videos/uploadVideo", { pageTitle: "비디오 업로드" });
};

export const handlePostUploadVideo = async (req: Request, res: Response) => {
  const {
    body: { title, description, hashtags },
  } = req;

  const createdVideo = await Video.create({
    title,
    description,
    hashtags: hashtags.split(",").map((hashtag: string) => `#${hashtag}`),
    createdAt: Date.now(),
    meta: {
      rating: 0,
      views: 0,
    },
  });

  console.log("createdVideo", createdVideo);

  return res.redirect("/");
};

export const handleDeleteVideo = (req: Request, res: Response) => {
  return res.send("handleDeleteVideo");
};
