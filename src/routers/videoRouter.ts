import express, { Router } from "express";
import { handleGetEditVideo, handlePostEditVideo, handleSeeVideo, handleDeleteVideo, handleGetUploadVideo, handlePostUploadVideo } from "../controllers/videoController";
import { privateMiddleware, videoMulterMiddleware } from "../middlewares";

const videoRouter: Router = express.Router();

videoRouter.get("/upload", privateMiddleware, handleGetUploadVideo);
videoRouter.post("/upload", privateMiddleware, videoMulterMiddleware, handlePostUploadVideo);
videoRouter.get("/:id", handleSeeVideo);
videoRouter.get("/:id([0-9a-f]{24})/edit", privateMiddleware, handleGetEditVideo);
videoRouter.post("/:id([0-9a-f]{24})/edit", privateMiddleware, handlePostEditVideo);
videoRouter.get("/:id([0-9a-f]{24})/delete", privateMiddleware, handleDeleteVideo);

export default videoRouter;
