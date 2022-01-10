import { Request, Response } from "express";
import Video from "../models/Video";

export const handleHome = (req: Request, res: Response) => {
  Video.find({}, () => {
    console.log("hello");
  });

  // return res.render("globals/home", { pageTitle: "홈" });
  return res.send("");
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
