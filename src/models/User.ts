import mongoose from "mongoose";

export interface UserModel {
  username: string;
  email: string;
  password: string;
  avatarUrl: string;
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

const User: mongoose.Model<UserModel> = mongoose.model("User", userSchema);

export default User;
