import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT: number = 4000;
const app: Express = express();

/**
 * /Users/gw/Desktop/coding/youtube-clone2/views
 * /Users/gw/Desktop/coding/youtube-clone2/src/views
 */

app.use(morgan("dev"));
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
