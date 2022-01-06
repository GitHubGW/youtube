import express, { Router } from "express";
import { handleEditVideo, handleSeeVideo, handleDeleteVideo, handleUploadVideo } from "../controllers/videoController";

const videoRouter: Router = express.Router();

videoRouter.get("/:id(\\d+)", handleSeeVideo);
videoRouter.get("/:id(\\d+)/edit", handleEditVideo);
videoRouter.get("/:id(\\d+)/delete", handleDeleteVideo);
videoRouter.get("/upload", handleUploadVideo);

export default videoRouter;
