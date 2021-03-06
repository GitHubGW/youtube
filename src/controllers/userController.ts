import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { UserInterface } from "../models/User";

export const handleSeeUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundUser: UserInterface | null = await User.findOne({ username: req.params.username }).populate({
      path: "videos",
      populate: {
        path: "user",
      },
    });

    if (foundUser === null) {
      throw new Error();
    }

    return res.render("users/seeUser", { pageTitle: `${req.params.username} 프로필`, user: foundUser, videos: foundUser.videos?.reverse() });
  } catch (error) {
    console.log("handleSeeUser error");
    return res.status(404).render("404", { pageTitle: "페이지를 찾을 수 없습니다." });
  }
};

export const handleGetEditProfile = (req: Request, res: Response): void => {
  return res.render("users/editProfile", { pageTitle: `${req.params.username} 프로필 수정` });
};

export const handlePostEditProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const {
      body: { username, email },
      session: { loggedInUser },
      file,
    } = req;

    const updatedUser: UserInterface | null = await User.findByIdAndUpdate(
      loggedInUser?._id,
      { $set: { username, email, avatarUrl: file?.path ? file?.path : file?.location } },
      { new: true }
    );

    if (updatedUser === null) {
      throw new Error();
    }

    req.session.loggedInUser = updatedUser;
    req.flash("success", "성공적으로 프로필을 업데이트하였습니다.");
    return res.redirect(`/users/${updatedUser?.username}`);
  } catch (error) {
    console.log("handlePostEditProfile error");
    req.flash("fail", "이미 존재하는 이름 또는 이메일입니다.");
    return res.status(400).render("users/editProfile", { pageTitle: `${req.params.username} 프로필 수정`, errorMessage: "이미 존재하는 이름 또는 이메일입니다." });
  }
};

export const handleGetChangePassword = (req: Request, res: Response): void => {
  const {
    session: { loggedInUser },
  } = req;

  if (loggedInUser?.githubId === null && loggedInUser.kakaoId === null) {
    return res.render("users/changePassword", { pageTitle: `${req.params.username} 비밀번호 변경` });
  }

  return res.redirect(`/users/${loggedInUser?.username}`);
};

export const handlePostChangePassword = async (req: Request, res: Response): Promise<void> => {
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
      req.flash("fail", "기존 비밀번호가 일치하지 않습니다.");
      return res.status(400).render("users/changePassword", { pageTitle: `${req.params.username} 비밀번호 변경`, errorMessage: "기존 비밀번호가 일치하지 않습니다." });
    }
    if (newPassword !== newPasswordConfirm) {
      req.flash("fail", "새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
      return res
        .status(400)
        .render("users/changePassword", { pageTitle: `${req.params.username} 비밀번호 변경`, errorMessage: "새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다." });
    }

    const updatedUser: UserInterface | null = await User.findByIdAndUpdate(loggedInUser?._id, { $set: { password: newPassword } }, { new: true });
    await updatedUser?.save();
    req.flash("success", "성공적으로 비밀번호를 변경하였습니다.");
    return res.redirect(`/users/${loggedInUser?.username}`);
  } catch (error) {
    console.log("handlePostChangeProfile error");
    req.flash("fail", "비밀번호 변경에 실패하였습니다.");
    return res.status(400).render("users/changePassword", { pageTitle: `${req.params.username} 비밀번호 변경`, errorMessage: "비밀번호 변경에 실패하였습니다." });
  }
};
