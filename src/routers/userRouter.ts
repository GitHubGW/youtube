import express, { Router } from "express";
import {
  handleDeleteUser,
  handleProfile,
  handleGetEditProfile,
  handlePostEditProfile,
  handleGetChangeProfile,
  handlePostChangeProfile,
  handleSeeUser,
} from "../controllers/userController";
import { avatarMulterMiddleware, privateMiddleware } from "../middlewares";

const userRouter: Router = express.Router();

userRouter.get("/profile", handleProfile);
userRouter.get("/profile/edit", privateMiddleware, handleGetEditProfile);
userRouter.post("/profile/edit", privateMiddleware, avatarMulterMiddleware.single("avatar"), handlePostEditProfile);
userRouter.get("/password/change", privateMiddleware, handleGetChangeProfile);
userRouter.post("/password/change", privateMiddleware, handlePostChangeProfile);
userRouter.get("/delete", privateMiddleware, handleDeleteUser);
userRouter.get("/:id", handleSeeUser);

export default userRouter;
