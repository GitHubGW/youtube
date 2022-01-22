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
import { publicMiddleware, privateMiddleware } from "../middlewares";

const globalRouter: Router = express.Router();

globalRouter.get("/", handleHome);
globalRouter.get("/join", publicMiddleware, handleGetJoin);
globalRouter.post("/join", publicMiddleware, handlePostJoin);
globalRouter.get("/login", publicMiddleware, handleGetLogin);
globalRouter.post("/login", publicMiddleware, handlePostLogin);
globalRouter.get("/logout", privateMiddleware, handleLogout);
globalRouter.get("/search", handleSearch);
globalRouter.get("/github/auth/start", publicMiddleware, handleGitHubAuthStart);
globalRouter.get("/github/auth/end", publicMiddleware, handleGitHubAuthEnd);
globalRouter.get("/kakao/auth/start", publicMiddleware, handleKakaoAuthStart);
globalRouter.get("/kakao/auth/end", publicMiddleware, handleKakaoAuthEnd);

export default globalRouter;
