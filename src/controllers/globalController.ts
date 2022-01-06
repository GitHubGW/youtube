import { Request, Response } from "express";

export const handleHome = (req: Request, res: Response) => {
  return res.render("global/home");
};

export const handleJoin = (req: Request, res: Response) => {
  return res.send("handleJoin");
};

export const handleLogin = (req: Request, res: Response) => {
  return res.send("handleLogin");
};

export const handleLogout = (req: Request, res: Response) => {
  return res.send("handleLogout");
};

export const handleSearch = (req: Request, res: Response) => {
  return res.send("handleSearch");
};
