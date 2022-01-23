import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { UserInterface } from "../models/User";

export const handleProfile = (req: Request, res: Response): void => {
  return res.render("users/profile", { pageTitle: `${req.session.loggedInUser?.username} 프로필` });
};

export const handleGetEditProfile = (req: Request, res: Response): void => {
  return res.render("users/editProfile", { pageTitle: "프로필 수정" });
};

export const handlePostEditProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { username, email },
      session: { loggedInUser },
      file,
    } = req;
    const updatedUser: UserInterface | null = await User.findByIdAndUpdate(loggedInUser?._id, { $set: { username, email, avatarUrl: file?.path } }, { new: true });

    if (updatedUser === null) {
      throw new Error();
    }

    req.session.loggedInUser = updatedUser;
    return res.redirect("/users/profile/edit");
  } catch (error) {
    console.log("handlePostEditProfile error");
    return res.status(400).render("users/editProfile", { pageTitle: "프로필 수정", errorMessage: "이미 존재하는 이름 또는 이메일입니다." });
  }
};

export const handleGetChangeProfile = (req: Request, res: Response): void => {
  const {
    session: { loggedInUser },
  } = req;

  if (loggedInUser?.githubId === null && loggedInUser.kakaoId === null) {
    return res.render("users/changePassword", { pageTitle: "비밀번호 변경" });
  }
  return res.redirect("/users/profile");
};

export const handlePostChangeProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { oldPassword, newPassword, newPasswordConfirm },
      session: { loggedInUser },
    } = req;
    const foundUser: UserInterface | null = await User.findById({ _id: loggedInUser?._id });

    if (foundUser === null) {
      throw new Error();
    }

    const isMatchedPassword: boolean = await bcrypt.compare(oldPassword, foundUser?.password as string);

    if (isMatchedPassword === false) {
      return res.status(400).render("users/changePassword", { pageTitle: "비밀번호 변경", errorMessage: "기존 비밀번호가 일치하지 않습니다." });
    }
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).render("users/changePassword", { pageTitle: "비밀번호 변경", errorMessage: "새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다." });
    }

    const updatedUser = await User.findByIdAndUpdate(loggedInUser?._id, { $set: { password: newPassword } }, { new: true });
    await updatedUser?.save();
    return res.redirect("/users/profile");
  } catch (error) {
    console.log("handlePostChangeProfile error");
    return res.status(400).render("users/changePassword", { pageTitle: "비밀번호 변경", errorMessage: "비밀번호 변경에 실패하였습니다." });
  }
};

export const handleDeleteUser = (req: Request, res: Response) => {
  return res.send("handleDeleteUser");
};

export const handleSeeUser = (req: Request, res: Response) => {
  return res.send("handleSeeUser");
};
