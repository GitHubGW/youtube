import { Request, Response } from "express";
import Video from "../models/Video";

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

export const handlePostUploadVideo = (req: Request, res: Response): void => {
  const {
    body: { title },
  } = req;

  return res.redirect("/");
};

export const handleDeleteVideo = (req: Request, res: Response) => {
  return res.send("handleDeleteVideo");
};
