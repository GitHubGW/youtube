import { Request, Response } from "express";

const fakeUser = {
  username: "gw",
  isLoggedIn: true,
};

export const handleHome = (req: Request, res: Response) => {
  return res.render("globals/home", { pageTitle: "홈", fakeUser });
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
