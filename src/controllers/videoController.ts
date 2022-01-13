import { Request, Response } from "express";
import Video from "../models/Video";

export const handleSeeVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
    } = req;
    const foundVideo = await Video.findById(id);

    if (foundVideo === null) {
      throw new Error();
    }

    return res.render("videos/seeVideo", { pageTitle: `${foundVideo?.title}`, video: foundVideo });
  } catch (error) {
    console.log("handleSeeVideo error");
    return res.render("404", { pageTitle: "페이지를 찾을 수 없습니다." });
  }
};

export const handleGetEditVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
    } = req;
    const foundVideo = await Video.findById(id);

    if (foundVideo === null) {
      throw new Error();
    }

    return res.render("videos/editVideo", { pageTitle: "비디오 수정", video: foundVideo });
  } catch (error) {
    console.log("handleGetEditVideo error");
    return res.render("404", { pageTitle: "페이지를 찾을 수 없습니다." });
  }
};

export const handlePostEditVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body: { title, description, hashtags },
    } = req;
    const existingVideo: boolean = await Video.exists({ _id: id });

    if (existingVideo === false) {
      throw new Error();
    }

    const formattedHashtags: string[] = hashtags.split(",").map((hashtag: string) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
    await Video.findByIdAndUpdate(id, { title, description, hashtags: formattedHashtags });
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    console.log("handlePostEditVideo error");
    return res.render("404", { pageTitle: "페이지를 찾을 수 없습니다." });
  }
};

export const handleGetUploadVideo = (req: Request, res: Response): void => {
  return res.render("videos/uploadVideo", { pageTitle: "비디오 업로드" });
};

export const handlePostUploadVideo = async (req: Request, res: Response) => {
  try {
    const {
      body: { title, description, hashtags },
    } = req;
    const formattedHashtags: string[] = hashtags.split(",").map((hashtag: string) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
    await Video.create({ title, description, hashtags: formattedHashtags });
    return res.redirect("/");
  } catch (error) {
    console.log("handlePostUploadVideo error");
    return res.render("videos/uploadVideo", { pageTitle: "비디오 업로드", errorMessage: "비디오 업로드에 실패하였습니다." });
  }
};

export const handleDeleteVideo = (req: Request, res: Response) => {
  return res.send("handleDeleteVideo");
};
