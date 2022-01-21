import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserInterface {
  _id: object;
  githubId: number | null;
  kakaoId: number | null;
  username: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  createdAt: number;
  __v?: number;
}

export interface UserModel extends Document {
  githubId: number | null;
  kakaoId: number | null;
  username: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  createdAt: number;
}

const { Schema } = mongoose;

const userSchema: mongoose.Schema = new Schema({
  githubId: { type: Number, required: false, default: null },
  kakaoId: { type: Number, required: false, default: null },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String, required: false },
  password: { type: String, required: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

userSchema.pre<UserModel>("save", async function () {
  if (this.githubId === null && this.kakaoId === null) {
    this.password = await bcrypt.hash(this.password as string, 10);
  }
});

const User: mongoose.Model<UserInterface> = mongoose.model("User", userSchema);

export default User;
