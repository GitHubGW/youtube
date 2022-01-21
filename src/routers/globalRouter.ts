import express, { Router } from "express";
import {
  handleHome,
  handleGetJoin,
  handlePostJoin,
  handleGetLogin,
  handlePostLogin,
  handleLogout,
  handleSearch,
  handleGitHubAuthStart,
  handleGitHubAuthEnd,
  handleKakaoAuthStart,
  handleKakaoAuthEnd,
} from "../controllers/globalController";

const globalRouter: Router = express.Router();

globalRouter.get("/", handleHome);
globalRouter.get("/join", handleGetJoin);
globalRouter.post("/join", handlePostJoin);
globalRouter.get("/login", handleGetLogin);
globalRouter.post("/login", handlePostLogin);
globalRouter.get("/logout", handleLogout);
globalRouter.get("/search", handleSearch);
globalRouter.get("/github/auth/start", handleGitHubAuthStart);
globalRouter.get("/github/auth/end", handleGitHubAuthEnd);
globalRouter.get("/kakao/auth/start", handleKakaoAuthStart);
globalRouter.get("/kakao/auth/end", handleKakaoAuthEnd);

export default globalRouter;
