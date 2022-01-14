import express, { Router } from "express";
import { handleHome, handleGetJoin, handlePostJoin, handleLogin, handleLogout, handleSearch } from "../controllers/globalController";

const globalRouter: Router = express.Router();

globalRouter.get("/", handleHome);
globalRouter.get("/join", handleGetJoin);
globalRouter.post("/join", handlePostJoin);
globalRouter.get("/login", handleLogin);
globalRouter.get("/logout", handleLogout);
globalRouter.get("/search", handleSearch);

export default globalRouter;
