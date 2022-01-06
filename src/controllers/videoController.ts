import { Request, Response } from "express";

export const handleSeeVideo = (req: Request, res: Response) => {
  console.log("req.params", req.params);

  return res.send("handleSeeVideo");
};

export const handleEditVideo = (req: Request, res: Response) => {
  return res.send("handleEditVideo");
};

export const handleDeleteVideo = (req: Request, res: Response) => {
  return res.send("handleDeleteVideo");
};

export const handleUploadVideo = (req: Request, res: Response) => {
  return res.send("handleUploadVideo");
};
