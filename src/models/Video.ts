import mongoose from "mongoose";

export interface VideoModel {
  title: string;
  description: string;
  hashtags: string[];
  createdAt: number;
  meta: {
    views: number;
    rating: number;
  };
}

const { Schema } = mongoose;

const videoSchema: mongoose.Schema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 20 },
  description: { type: String, required: false, trim: true, maxlength: 100 },
  hashtags: [{ type: String, required: false, trim: true }],
  createdAt: { type: Date, required: true, default: Date.now },
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

const Video: mongoose.Model<VideoModel> = mongoose.model("Video", videoSchema);

export default Video;
