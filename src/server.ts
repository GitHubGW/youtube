import "dotenv/config";
import "./db";
import express, { Express } from "express";
import morgan from "morgan";
import session from "express-session";
import { crossOriginMiddleware, localsMiddleware } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";

const PORT: number = 4000;
const app: Express = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL as string }),
    cookie: { maxAge: 1000000000 },
  })
);
app.use(localsMiddleware);
app.use(crossOriginMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/images", express.static("src/images"));
app.use("/node_modules", express.static("node_modules/@ffmpeg/core/dist"));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
