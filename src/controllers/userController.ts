import { Request, Response } from "express";
import User, { UserInterface } from "../models/User";

export const handleGetEditProfile = (req: Request, res: Response): void => {
  return res.render("users/editProfile", { pageTitle: "프로필 수정" });
};

export const handlePostEditProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { username, email },
      session: { loggedInUser },
    } = req;
    const updatedUser: UserInterface | null = await User.findByIdAndUpdate(loggedInUser?._id, { $set: { username, email } }, { new: true });

    if (updatedUser === null) {
      throw new Error();
    }

    req.session.loggedInUser = updatedUser;
    return res.redirect("/users/edit");
  } catch (error) {
    console.log("handlePostEditProfile error");
    return res.render("users/editProfile", { pageTitle: "프로필 수정", errorMessage: "이미 존재하는 이름 또는 이메일입니다." });
  }
};

export const handleDeleteUser = (req: Request, res: Response) => {
  return res.send("handleDeleteUser");
};

export const handleSeeUser = (req: Request, res: Response) => {
  return res.send("handleSeeUser");
};
