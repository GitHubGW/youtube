import { Request, Response } from "express";
import Video from "../models/Video";

export const handleHome = async (req: Request, res: Response) => {
  try {
    const foundVideo = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("globals/home", { pageTitle: "홈", videos: foundVideo });
  } catch (error) {
    throw new Error("handleHome error");
  }
};

export const handleJoin = (req: Request, res: Response) => {
  return res.send("handleJoin");
};

export const handleLogin = (req: Request, res: Response) => {
  return res.render("globals/login");
};

export const handleLogout = (req: Request, res: Response) => {
  return res.send("handleLogout");
};

export const handleSearch = async (req: Request, res: Response) => {
  try {
    const {
      query: { title },
    } = req;

    if (title === undefined) {
      return res.render("globals/search", { pageTitle: "비디오 검색", videos: [] });
    }

    const foundVideo = await Video.find({
      title: {
        $regex: new RegExp(title as string, "i"), // $regex: /title/i
      },
    });

    if (foundVideo.length === 0) {
      return res.render("globals/search", { pageTitle: "비디오 검색", videos: [], errorMessage: "비디오를 찾을 수 없습니다." });
    }

    return res.render("globals/search", { pageTitle: "비디오 검색", videos: foundVideo });
  } catch (error) {
    console.log("handleSearch error");
    return res.render("globals/search", { pageTitle: "비디오 검색", videos: [] });
  }
};
