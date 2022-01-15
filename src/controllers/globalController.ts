import { Request, Response } from "express";
import Video from "../models/Video";
import User from "../models/User";

export const handleHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundVideo = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("globals/home", { pageTitle: "홈", videos: foundVideo });
  } catch (error) {
    console.log("handleHome error");
    return res.render("globals/home", { pageTitle: "홈", videos: [] });
  }
};

export const handleGetJoin = (req: Request, res: Response): void => {
  return res.render("globals/join", { pageTitle: "회원가입" });
};

export const handlePostJoin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { username, email, password, confirmPassword },
    } = req;

    const existingUsernameOrEmail: boolean = await User.exists({ $or: [{ username }, { email }] });

    if (existingUsernameOrEmail) {
      return res.status(400).render("globals/join", { pageTitle: "회원가입", errorMessage: "이미 존재하는 유저명 또는 이메일입니다." });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("globals/join", { pageTitle: "회원가입", errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    await User.create({ username, email, password });
    return res.redirect("/login");
  } catch (error) {
    console.log("handlePostJoin error");
    return res.status(400).render("globals/join", { pageTitle: "회원가입", errorMessage: "회원가입에 실패하였습니다." });
  }
};

export const handleLogin = (req: Request, res: Response) => {
  return res.render("globals/login");
};

export const handleLogout = (req: Request, res: Response) => {
  return res.send("handleLogout");
};

export const handleSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query: { title },
    } = req;

    if (title === undefined) {
      return res.render("globals/search", { pageTitle: "비디오 검색", videos: [] });
    }

    const foundVideo = await Video.find({
      title: {
        $regex: new RegExp(title as string, "i"), // $regex: /title/i
      },
    });

    if (foundVideo.length === 0) {
      return res.render("globals/search", { pageTitle: "비디오 검색", videos: [], errorMessage: "비디오를 찾을 수 없습니다." });
    }

    return res.render("globals/search", { pageTitle: "비디오 검색", videos: foundVideo });
  } catch (error) {
    console.log("handleSearch error");
    return res.status(400).render("globals/search", { pageTitle: "비디오 검색", videos: [] });
  }
};
