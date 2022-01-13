import { Request, Response } from "express";
import Video from "../models/Video";

export const handleHome = async (req: Request, res: Response) => {
  try {
    const foundVideo = await (await Video.find({})).reverse();
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

export const handleSearch = (req: Request, res: Response) => {
  return res.send("handleSearch");
};
