import express, { Router } from "express";
import { handleEditVideo, handleSeeVideo, handleDeleteVideo, handleUploadVideo } from "../controllers/videoController";

const videoRouter: Router = express.Router();

videoRouter.get("/:id", handleSeeVideo);
videoRouter.get("/:id/edit", handleEditVideo);
videoRouter.get("/:id/delete", handleDeleteVideo);
videoRouter.get("/upload", handleUploadVideo);

export default videoRouter;
