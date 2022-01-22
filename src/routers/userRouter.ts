import express, { Router } from "express";
import { handleDeleteUser, handleGetEditProfile, handlePostEditProfile, handleSeeUser } from "../controllers/userController";
import { publicMiddleware, privateMiddleware } from "../middlewares";

const userRouter: Router = express.Router();

userRouter.get("/edit", privateMiddleware, handleGetEditProfile);
userRouter.post("/edit", privateMiddleware, handlePostEditProfile);
userRouter.get("/delete", privateMiddleware, handleDeleteUser);
userRouter.get("/:id", handleSeeUser);

export default userRouter;
