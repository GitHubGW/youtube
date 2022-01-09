import express, { Express } from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT: number = 4000;
const app: Express = express();

app.use(morgan("dev"));
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
