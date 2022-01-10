import mongoose from "mongoose";

interface VideoModel {
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
  title: String,
  description: String,
  hashtags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  meta: {
    views: Number,
    rating: Number,
  },
});

const Video: mongoose.Model<VideoModel> = mongoose.model("Video", videoSchema);

export default Video;
