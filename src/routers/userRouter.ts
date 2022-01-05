import express, { Router } from "express";
import { handleDeleteUser, handleEditUser, handleSeeUser } from "../controllers/userController";

const userRouter: Router = express.Router();

userRouter.get("/delete", handleDeleteUser);
userRouter.get("/:id", handleSeeUser);
userRouter.get("/:id/edit", handleEditUser);

export default userRouter;
