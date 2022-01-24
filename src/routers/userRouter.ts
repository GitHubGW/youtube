import express, { Router } from "express";
import { handleDeleteUser, handleSeeUser, handleGetEditProfile, handlePostEditProfile, handleGetChangeProfile, handlePostChangeProfile } from "../controllers/userController";
import { avatarMulterMiddleware, privateMiddleware } from "../middlewares";

const userRouter: Router = express.Router();

userRouter.get("/:username", handleSeeUser);
userRouter.get("/:username/profile/edit", privateMiddleware, handleGetEditProfile);
userRouter.post("/:username/profile/edit", privateMiddleware, avatarMulterMiddleware.single("avatar"), handlePostEditProfile);
userRouter.get("/:username/password/change", privateMiddleware, handleGetChangeProfile);
userRouter.post("/:username/password/change", privateMiddleware, handlePostChangeProfile);
userRouter.get("/delete", privateMiddleware, handleDeleteUser);

export default userRouter;
