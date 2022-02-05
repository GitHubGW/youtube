import mongoose, { Schema, Types } from "mongoose";

export interface CommentInterface {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  video: Types.ObjectId;
  text: string;
  createdAt: number;
  __v?: number;
}

const commentSchema: mongoose.Schema<CommentInterface> = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: Schema.Types.ObjectId, required: true, ref: "Video" },
  text: { type: String, required: true, min: 1 },
  createdAt: { type: Number, required: true, default: Date.now },
});

const Comment: mongoose.Model<CommentInterface> = mongoose.model("Comment", commentSchema);

export default Comment;
