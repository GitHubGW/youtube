import express, { NextFunction, Request, Response, Router } from "express";
import morgan from "morgan";

const PORT = 4000;
const app = express();

app.use(morgan("dev"));

const globalRouter: Router = express.Router();

const handleHome = (req: Request, res: Response) => {
  return res.send("handleHome");
};

globalRouter.get("/", handleHome);

const userRouter: Router = express.Router();

const handleEditUser = (req: Request, res: Response) => {
  return res.send("handleEditUser");
};

userRouter.get("/edit", handleEditUser);

const videoRouter: Router = express.Router();

const handleSeeVideo = (req: Request, res: Response) => {
  return res.send("handleSeeVideo");
};

videoRouter.get("/see", handleSeeVideo);

app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

app.get("/", (req: Request, res: Response) => {
  return res.send("<h1>home</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
