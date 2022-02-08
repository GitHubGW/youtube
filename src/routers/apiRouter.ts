import express, { Router } from "express";
import { handleIncreaseView, handleCreateComment } from "../controllers/apiController";

const apiRouter: Router = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/views", handleIncreaseView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", handleCreateComment);

export default apiRouter;
