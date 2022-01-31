import { Request, Response } from "express";
import Video, { VideoInterface } from "../models/Video";

export const handleIncreaseView = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      params: { id },
    } = req;
    const foundVideo: VideoInterface | null = await Video.findById(id);

    if (foundVideo === null) {
      throw new Error();
    }

    foundVideo.meta.views = foundVideo.meta.views + 1;
    await foundVideo.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log("handleIncreaseView error");
    return res.sendStatus(404);
  }
};
