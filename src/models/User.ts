import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserInterface {
  _id: object;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: number;
  __v?: number;
}

export interface UserModel extends Document {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: number;
}

const { Schema } = mongoose;

const userSchema: mongoose.Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: { type: String, required: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

userSchema.pre<UserModel>("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User: mongoose.Model<UserInterface> = mongoose.model("User", userSchema);

export default User;
