import mongoose, { Document, Schema, Types } from "mongoose";

export interface VideoInterface extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  comments?: Types.ObjectId[];
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  hashtags: string[];
  createdAt: number;
  meta: {
    views: number;
    rating: number;
  };
  __v?: number;
}

const videoSchema: mongoose.Schema<VideoInterface> = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, required: false, ref: "Comment" }],
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: false },
  title: { type: String, required: true, trim: true, maxlength: 20 },
  description: { type: String, required: false, trim: true, maxlength: 100 },
  hashtags: [{ type: String, required: false, trim: true }],
  createdAt: { type: Number, required: true, default: Date.now },
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

const Video: mongoose.Model<VideoInterface> = mongoose.model("Video", videoSchema);

export default Video;
