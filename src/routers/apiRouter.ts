import express, { Router } from "express";
import { handleIncreaseView } from "../controllers/apiController";

const apiRouter: Router = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/views", handleIncreaseView);

export default apiRouter;
