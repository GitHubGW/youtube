import { Request, Response } from "express";
import Comment from "../models/Comment";
import User, { UserInterface } from "../models/User";
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

export const handleCreateComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      params: { id },
      body: { text },
      session: { loggedInUser },
    } = req;
    const foundVideo: VideoInterface | null = await Video.findById(id);
    const foundUser: UserInterface | null = await User.findById(loggedInUser?._id).populate("comments");

    if (foundVideo === null || foundUser === null) {
      throw new Error();
    }

    const createdComment = await Comment.create({ user: loggedInUser?._id, video: foundVideo._id, text });
    await Video.findByIdAndUpdate(id, { $set: { comments: [...(foundVideo.comments as []), createdComment] } });
    await User.findByIdAndUpdate(loggedInUser?._id, { $set: { comments: [...(foundUser.comments as []), createdComment] } });
    return res.sendStatus(201);
  } catch (error) {
    console.log("handleCreateComment error");
    return res.sendStatus(404);
  }
};
