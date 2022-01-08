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

export const handleHome = (req: Request, res: Response) => {
  return res.render("globals/home", { pageTitle: "홈", videos: sampleVideo });
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
