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

export default globalRouter;
