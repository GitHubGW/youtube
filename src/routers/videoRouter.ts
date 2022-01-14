import express, { Router } from "express";
import { handleGetEditVideo, handlePostEditVideo, handleSeeVideo, handleGetDeleteVideo, handleGetUploadVideo, handlePostUploadVideo } from "../controllers/videoController";

const videoRouter: Router = express.Router();

videoRouter.get("/upload", handleGetUploadVideo);
videoRouter.post("/upload", handlePostUploadVideo);
videoRouter.get("/:id([0-9a-f]{24})", handleSeeVideo);
videoRouter.get("/:id([0-9a-f]{24})/edit", handleGetEditVideo);
videoRouter.post("/:id([0-9a-f]{24})/edit", handlePostEditVideo);
videoRouter.get("/:id([0-9a-f]{24})/delete", handleGetDeleteVideo);

export default videoRouter;
