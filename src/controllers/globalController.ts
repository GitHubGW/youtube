import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Video, { VideoInterface } from "../models/Video";
import User, { UserInterface } from "../models/User";
import fetch from "cross-fetch";

declare module "express-session" {
  interface SessionData {
    loggedInUser: UserInterface;
    isLoggedIn: boolean;
  }
}

interface AuthorizeParams {
  client_id: string;
  allow_signup: boolean;
  scope: string;
}

interface AccessTokenParams {
  client_id: string;
  client_secret: string;
  code: string;
}

interface UserEmailObject {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}

export const handleHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundVideo: VideoInterface[] = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("globals/home", { pageTitle: "홈", videos: foundVideo, sessionId: req.sessionID });
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
    console.log("handlePostJoin error", error);
    return res.status(400).render("globals/join", { pageTitle: "회원가입", errorMessage: "회원가입에 실패하였습니다." });
  }
};

export const handleGetLogin = (req: Request, res: Response): void => {
  return res.render("globals/login", { pageTitle: "로그인" });
};

export const handlePostLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { email, password },
    } = req;
    const foundUser: UserInterface | null = await User.findOne({ email, githubId: null });

    if (foundUser === null) {
      return res.status(400).render("globals/login", { pageTitle: "로그인", errorMessage: "존재하지 않는 이메일입니다." });
    }

    const isMatchedPassword: boolean = await bcrypt.compare(password, foundUser.password as string);

    if (isMatchedPassword === false) {
      return res.status(400).render("globals/login", { pageTitle: "로그인", errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    req.session.loggedInUser = foundUser;
    req.session.isLoggedIn = true;
    return res.redirect("/");
  } catch (error) {
    console.log("handlePostLogin error");
    return res.status(400).render("globals/login", { pageTitle: "로그인", errorMessage: "로그인에 실패하였습니다." });
  }
};

export const handleLogout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    return res.redirect("/");
  });
};

export const handleSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query: { title },
    } = req;

    if (title === undefined) {
      return res.render("globals/search", { pageTitle: "비디오 검색", videos: [] });
    }

    const foundVideo: VideoInterface[] = await Video.find({
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

export const handleGitHubAuthStart = (req: Request, res: Response): void => {
  const baseUrl: string = "https://github.com/login/oauth/authorize";
  const authorizeParams: AuthorizeParams = {
    client_id: process.env.GITHUB_CLIENT_ID as string,
    allow_signup: true,
    scope: "read:user user:email",
  };
  const urlSearchParams: string = new URLSearchParams(authorizeParams as any).toString();
  const githubAuthorizeUrl: string = `${baseUrl}?${urlSearchParams}`;
  return res.redirect(githubAuthorizeUrl);
};

export const handleGitHubAuthEnd = async (req: Request, res: Response) => {
  const baseUrl: string = "https://github.com/login/oauth/access_token";
  const accessTokenParams: AccessTokenParams = {
    client_id: process.env.GITHUB_CLIENT_ID as string,
    client_secret: process.env.GITHUB_CLIENT_SECRET as string,
    code: req.query.code as string,
  };
  const urlSearchParams: string = new URLSearchParams(accessTokenParams as any).toString();
  const githubAccessTokenUrl: string = `${baseUrl}?${urlSearchParams}`;

  try {
    const tokenJsonData = await (await fetch(githubAccessTokenUrl, { method: "POST", headers: { Accept: "application/json" } })).json();

    if ("access_token" in tokenJsonData) {
      const { access_token } = tokenJsonData;
      const githubUserJsonData = await (await fetch("https://api.github.com/user", { method: "GET", headers: { Authorization: `token ${access_token}` } })).json();
      const githubEmailJsonData = await (await fetch("https://api.github.com/user/emails", { method: "GET", headers: { Authorization: `token ${access_token}` } })).json();
      const userEmailObject: UserEmailObject | undefined = githubEmailJsonData.find((emailObject: any) => emailObject.primary === true && emailObject.verified === true);

      if (userEmailObject === undefined) {
        return res.redirect("/login");
      }

      const foundUser: UserInterface | null = await User.findOne({ email: userEmailObject.email });

      if (foundUser) {
        req.session.loggedInUser = foundUser;
        req.session.isLoggedIn = true;
        return res.redirect("/");
      } else {
        const createdUser: UserInterface = await User.create({
          githubId: githubUserJsonData.id,
          username: githubUserJsonData.name,
          email: userEmailObject.email,
          avatarUrl: githubUserJsonData.avatar_url,
        });
        req.session.loggedInUser = createdUser;
        req.session.isLoggedIn = true;
        return res.redirect("/");
      }
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log("handleGitHubAuthEnd error");
    return res.redirect("/login");
  }
};
