import express, { Router } from "express";
import { handleGetEditVideo, handlePostEditVideo, handleSeeVideo, handleDeleteVideo, handleGetUploadVideo, handlePostUploadVideo } from "../controllers/videoController";

const videoRouter: Router = express.Router();

videoRouter.get("/:id(\\d+)", handleSeeVideo);
videoRouter.get("/:id(\\d+)/edit", handleGetEditVideo);
videoRouter.post("/:id(\\d+)/edit", handlePostEditVideo);
videoRouter.get("/upload", handleGetUploadVideo);
videoRouter.post("/upload", handlePostUploadVideo);
videoRouter.get("/:id(\\d+)/delete", handleDeleteVideo);

export default videoRouter;
