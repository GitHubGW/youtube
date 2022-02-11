import express, { Router } from "express";
import { handleSeeUser, handleGetEditProfile, handlePostEditProfile, handleGetChangePassword, handlePostChangePassword } from "../controllers/userController";
import { avatarMulterMiddleware, deleteAvatarMiddleware, privateMiddleware } from "../middlewares";

const userRouter: Router = express.Router();

userRouter.get("/:username", handleSeeUser);
userRouter.get("/:username/profile/edit", privateMiddleware, handleGetEditProfile);
userRouter.post("/:username/profile/edit", privateMiddleware, avatarMulterMiddleware.single("avatar"), deleteAvatarMiddleware, handlePostEditProfile);
userRouter.get("/:username/password/change", privateMiddleware, handleGetChangePassword);
userRouter.post("/:username/password/change", privateMiddleware, handlePostChangePassword);

export default userRouter;
