import { Request, Response } from "express";

export const handleEditUser = (req: Request, res: Response) => {
  return res.send("handleEditUser");
};

export const handleDeleteUser = (req: Request, res: Response) => {
  return res.send("handleDeleteUser");
};

export const handleSeeUser = (req: Request, res: Response) => {
  return res.send("handleSeeUser");
};
