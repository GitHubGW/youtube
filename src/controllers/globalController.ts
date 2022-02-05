import { Request, Response } from "express";
import bcrypt from "bcrypt";
import fetch from "cross-fetch";
import Video, { VideoInterface } from "../models/Video";
import User, { UserInterface } from "../models/User";

declare module "express-session" {
  interface SessionData {
    loggedInUser: UserInterface;
    isLoggedIn: boolean;
  }
}

interface GitHubAuthorizeParams {
  client_id: string;
  allow_signup: boolean;
  scope: string;
}

interface GitHubAccessTokenParams {
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
    const foundVideos: VideoInterface[] = await Video.find({}).sort({ createdAt: "desc" }).populate("user");
    return res.render("globals/home", { pageTitle: "홈", videos: foundVideos });
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

    const existingUser: boolean = await User.exists({ $or: [{ username }, { email }] });

    if (existingUser) {
      req.flash("fail", "이미 존재하는 이름 또는 이메일입니다.");
      return res.status(400).render("globals/join", { pageTitle: "회원가입", errorMessage: "이미 존재하는 이름 또는 이메일입니다." });
    }
    if (password !== confirmPassword) {
      req.flash("fail", "비밀번호가 일치하지 않습니다.");
      return res.status(400).render("globals/join", { pageTitle: "회원가입", errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    const createdUser: UserInterface = await User.create({ username, email, password });
    req.session.loggedInUser = createdUser;
    req.session.isLoggedIn = true;
    req.flash("info", "유튜브에 오신 것을 환영합니다.");
    return res.redirect("/");
  } catch (error) {
    console.log("handlePostJoin error");
    req.flash("fail", "회원가입에 실패하였습니다.");
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
    const foundUser: UserInterface | null = await User.findOne({ email, githubId: null, kakaoId: null });

    if (foundUser === null) {
      req.flash("fail", "존재하지 않는 이메일입니다.");
      return res.status(400).render("globals/login", { pageTitle: "로그인", errorMessage: "존재하지 않는 이메일입니다." });
    }

    const isMatchedPassword: boolean = await bcrypt.compare(password, foundUser.password as string);

    if (isMatchedPassword === false) {
      req.flash("fail", "비밀번호가 일치하지 않습니다.");
      return res.status(400).render("globals/login", { pageTitle: "로그인", errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    req.session.loggedInUser = foundUser;
    req.session.isLoggedIn = true;
    req.flash("info", "유튜브에 오신 것을 환영합니다.");
    return res.redirect("/");
  } catch (error) {
    console.log("handlePostLogin error");
    req.flash("fail", "로그인에 실패하였습니다.");
    return res.status(400).render("globals/login", { pageTitle: "로그인", errorMessage: "로그인에 실패하였습니다." });
  }
};

export const handleLogout = (req: Request, res: Response): void => {
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

    const foundVideos: VideoInterface[] = await Video.find({
      title: {
        $regex: new RegExp(title as string, "i"), // $regex: /title/i
      },
    });

    if (foundVideos.length === 0) {
      return res.render("globals/search", { pageTitle: "비디오 검색", videos: [], title, errorMessage: "비디오를 찾을 수 없습니다." });
    }

    return res.render("globals/search", { pageTitle: "비디오 검색", videos: foundVideos, title });
  } catch (error) {
    console.log("handleSearch error");
    return res.status(400).render("globals/search", { pageTitle: "비디오 검색", videos: [], title: "" });
  }
};

export const handleGitHubAuthStart = (req: Request, res: Response): void => {
  const baseUrl: string = "https://github.com/login/oauth/authorize";
  const githubAuthorizeParams: GitHubAuthorizeParams = {
    client_id: process.env.GITHUB_CLIENT_ID as string,
    allow_signup: true,
    scope: "read:user user:email",
  };
  const urlSearchParams: string = new URLSearchParams(githubAuthorizeParams as any).toString();
  const githubAuthorizeUrl: string = `${baseUrl}?${urlSearchParams}`;
  return res.redirect(githubAuthorizeUrl);
};

export const handleGitHubAuthEnd = async (req: Request, res: Response): Promise<void> => {
  const baseUrl: string = "https://github.com/login/oauth/access_token";
  const githubAccessTokenParams: GitHubAccessTokenParams = {
    client_id: process.env.GITHUB_CLIENT_ID as string,
    client_secret: process.env.GITHUB_CLIENT_SECRET as string,
    code: req.query.code as string,
  };
  const urlSearchParams: string = new URLSearchParams(githubAccessTokenParams as any).toString();
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
    req.flash("fail", "깃허브 로그인에 실패하였습니다.");
    return res.render("globals/login", { errorMessage: "깃허브 로그인에 실패하였습니다." });
  }
};

export const handleKakaoAuthStart = (req: Request, res: Response): void => {
  const KAKAO_REST_API_KEY: string | undefined = process.env.KAKAO_REST_API_KEY;
  const REDIRECT_URI: string = "http://localhost:4000/kakao/auth/end";
  const kakaoAuthorizeUrl: string = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  return res.redirect(kakaoAuthorizeUrl);
};

export const handleKakaoAuthEnd = async (req: Request, res: Response): Promise<void> => {
  const KAKAO_REST_API_KEY: string | undefined = process.env.KAKAO_REST_API_KEY;
  const REDIRECT_URI: string = "http://localhost:4000/kakao/auth/end";
  const AUTHORIZE_CODE = req.query.code as string;
  const kakaoAccessTokenUrl: string = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${AUTHORIZE_CODE}`;

  try {
    const tokenJsonData = await (await fetch(kakaoAccessTokenUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" } })).json();

    if ("access_token" in tokenJsonData) {
      const { access_token } = tokenJsonData;
      const kakaoUserJsonData = await (
        await fetch("https://kapi.kakao.com/v2/user/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        })
      ).json();
      const foundUser: UserInterface | null = await User.findOne({ email: kakaoUserJsonData.kakao_account.email });

      if (foundUser) {
        req.session.loggedInUser = foundUser;
        req.session.isLoggedIn = true;
        return res.redirect("/");
      } else {
        const createdUser: UserInterface = await User.create({
          kakaoId: kakaoUserJsonData.id,
          username: kakaoUserJsonData.kakao_account.profile.nickname,
          email: kakaoUserJsonData.kakao_account.email,
          avatarUrl: kakaoUserJsonData.kakao_account.profile.profile_image_url,
        });
        req.session.loggedInUser = createdUser;
        req.session.isLoggedIn = true;
        return res.redirect("/");
      }
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log("handleKakaoAuthEnd error", error);
    req.flash("fail", "카카오 로그인에 실패하였습니다.");
    return res.render("globals/login", { errorMessage: "카카오 로그인에 실패하였습니다." });
  }
};
