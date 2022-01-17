import "./db";
import express, { Express } from "express";
import morgan from "morgan";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import MongoStore from "connect-mongo";

const PORT: number = 4000;
const app: Express = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "hello", resave: false, saveUninitialized: false, store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/youtube-portfolio" }) }));
app.use(localsMiddleware);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
