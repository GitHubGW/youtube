import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface UserInterface extends Document {
  _id: Types.ObjectId;
  githubId?: number | null;
  kakaoId?: number | null;
  username: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  createdAt: number;
  __v?: number;
}

const userSchema: mongoose.Schema<UserInterface> = new Schema({
  githubId: { type: Number, required: false, default: null },
  kakaoId: { type: Number, required: false, default: null },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String, required: false },
  password: { type: String, required: false },
  createdAt: { type: Number, required: true, default: Date.now },
});

userSchema.pre<UserInterface>("save", async function () {
  if (this.githubId === null && this.kakaoId === null) {
    this.password = await bcrypt.hash(this.password as string, 10);
  }
});

const User: mongoose.Model<UserInterface> = mongoose.model("User", userSchema);

export default User;
