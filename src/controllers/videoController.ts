import { Request, Response } from "express";
import { Types } from "mongoose";
import User, { UserInterface } from "../models/User";
import Video, { VideoInterface } from "../models/Video";

export const handleSeeVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
    } = req;
    const foundVideo: VideoInterface | null = await Video.findById(id).populate("user");
    const foundAllVideos: VideoInterface[] = await Video.find({}).populate("user");

    if (foundVideo === null) {
      throw new Error();
    }

    return res.render("videos/seeVideo", { pageTitle: `${foundVideo?.title}`, videos: foundAllVideos, video: foundVideo, user: foundVideo.user });
  } catch (error) {
    console.log("handleSeeVideo error");
    return res.status(404).render("404", { pageTitle: "페이지를 찾을 수 없습니다." });
  }
};

export const handleGetEditVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      session: { loggedInUser },
    } = req;
    const foundVideo: VideoInterface | null = await Video.findById(id);

    if (foundVideo === null) {
      throw new Error();
    }
    if (String(foundVideo.user._id) !== String(loggedInUser?._id)) {
      return res.status(403).redirect("/");
    }

    return res.render("videos/editVideo", { pageTitle: "비디오 수정", video: foundVideo });
  } catch (error) {
    console.log("handleGetEditVideo error");
    return res.status(404).render("404", { pageTitle: "페이지를 찾을 수 없습니다." });
  }
};

export const handlePostEditVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body: { title, description, hashtags },
      session: { loggedInUser },
    } = req;
    const foundVideo: VideoInterface | null = await Video.findById(id);

    if (foundVideo === null) {
      throw new Error();
    }
    if (String(foundVideo.user._id) !== String(loggedInUser?._id)) {
      return res.status(403).redirect("/");
    }

    const formattedHashtags: string[] = hashtags.split(",").map((hashtag: string) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
    await Video.findByIdAndUpdate(id, { title, description, hashtags: formattedHashtags });
    req.flash("success", "성공적으로 비디오를 수정하였습니다.");
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    console.log("handlePostEditVideo error");
    return res.status(404).render("404", { pageTitle: "페이지를 찾을 수 없습니다." });
  }
};

export const handleGetUploadVideo = (req: Request, res: Response): void => {
  return res.render("videos/uploadVideo", { pageTitle: "비디오 업로드" });
};

export const handlePostUploadVideo = async (req: any, res: Response): Promise<void> => {
  try {
    const {
      body: { title, description, hashtags },
      session: { loggedInUser },
      files,
    } = req;

    const formattedHashtags: string[] = hashtags.split(",").map((hashtag: string) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
    const createdVideo: VideoInterface = await Video.create({
      user: loggedInUser?._id,
      videoUrl: files.video[0].path,
      thumbnailUrl: files.thumbnail[0].path,
      title,
      description,
      hashtags: formattedHashtags,
    });
    const foundUser: UserInterface | null = await User.findById(loggedInUser?._id);

    if (foundUser === null) {
      throw new Error();
    }

    await User.findByIdAndUpdate(loggedInUser?._id, { $set: { videos: [...foundUser.videos, createdVideo] } });
    req.flash("success", "성공적으로 비디오를 업로드하였습니다.");
    return res.redirect("/");
  } catch (error) {
    console.log("handlePostUploadVideo error");
    req.flash("fail", "비디오 업로드에 실패하였습니다.");
    return res.status(400).render("videos/uploadVideo", { pageTitle: "비디오 업로드", errorMessage: "비디오 업로드에 실패하였습니다." });
  }
};

export const handleDeleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      session: { loggedInUser },
    } = req;
    const foundVideo: VideoInterface | null = await Video.findById(id);
    const foundUser: UserInterface | null = await User.findById(loggedInUser?._id);

    if (foundVideo === null || foundUser === null) {
      throw new Error();
    }
    if (String(foundVideo?.user._id) !== String(loggedInUser?._id)) {
      return res.status(403).redirect("/");
    }

    await Video.findByIdAndDelete(id);
    const filteredVideos: Types.ObjectId[] = foundUser.videos.filter((video) => String(video._id) !== String(foundVideo._id));
    await User.findByIdAndUpdate(loggedInUser?._id, { $set: { videos: filteredVideos } });
    req.flash("success", "성공적으로 비디오를 삭제하였습니다.");
    return res.redirect("/");
  } catch (error) {
    console.log("handleGetDeleteVideo error");
    return res.status(404).render("404", { pageTitle: "페이지를 찾을 수 없습니다." });
  }
};
