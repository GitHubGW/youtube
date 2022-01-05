import express, { Router } from "express";
import { handleHome, handleJoin, handleLogin, handleLogout, handleSearch } from "../controllers/globalController";

const globalRouter: Router = express.Router();

globalRouter.get("/", handleHome);
globalRouter.get("/join", handleJoin);
globalRouter.get("/login", handleLogin);
globalRouter.get("/logout", handleLogout);
globalRouter.get("/search", handleSearch);

export default globalRouter;
