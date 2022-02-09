import express, { Router } from "express";
import { handleIncreaseView, handleCreateComment, handleDeleteComment } from "../controllers/apiController";

const apiRouter: Router = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/views", handleIncreaseView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", handleCreateComment);
apiRouter.delete("/videos/:id([0-9a-f]{24})/comment/:commentid([0-9a-f]{24})", handleDeleteComment);

export default apiRouter;
