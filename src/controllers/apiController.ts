import { Request, Response } from "express";
import { Types } from "mongoose";
import Comment, { CommentInterface } from "../models/Comment";
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

    await Video.findByIdAndUpdate(id, { $set: { meta: { views: foundVideo.meta.views + 1 } } });
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

    const createdComment: CommentInterface = await Comment.create({ user: loggedInUser?._id, video: foundVideo._id, text });
    await Video.findByIdAndUpdate(id, { $set: { comments: [...(foundVideo.comments as []), createdComment] } });
    await User.findByIdAndUpdate(loggedInUser?._id, { $set: { comments: [...(foundUser.comments as []), createdComment] } });
    return res.status(201).send({ loggedInUser: req.session.loggedInUser, commentId: createdComment._id });
  } catch (error) {
    console.log("handleCreateComment error");
    return res.sendStatus(404);
  }
};

export const handleDeleteComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      params: { id, commentid },
      session: { loggedInUser },
    } = req;
    const deletedComment: CommentInterface | null = await Comment.findByIdAndDelete(commentid);
    const foundVideo: VideoInterface = await Video.findById(id).populate("comments");
    const filteredVideoComments: Types.ObjectId[] | undefined = foundVideo.comments?.filter((comment: Types.ObjectId) => comment._id !== deletedComment?._id);
    const foundUser: UserInterface = await User.findById(loggedInUser?._id).populate("comments");
    const filteredUserComments: Types.ObjectId[] | undefined = foundUser.comments?.filter((comment: Types.ObjectId) => comment._id !== deletedComment?._id);

    await Video.findByIdAndUpdate(id, { $set: { comments: filteredVideoComments } });
    await User.findByIdAndUpdate(loggedInUser?._id, { $set: { comments: filteredUserComments } });
    return res.sendStatus(200);
  } catch (error) {
    console.log("handleDeleteComment error");
    return res.sendStatus(404);
  }
};
