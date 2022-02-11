import { Request, Response, NextFunction } from "express";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

const s3: AWS.S3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const localsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.locals.loggedInUser = {};

  if (req.session.isLoggedIn === true) {
    res.locals.loggedInUser = req.session.loggedInUser;
    res.locals.isLoggedIn = req.session.isLoggedIn;
  }
  return next();
};

export const publicMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.isLoggedIn === undefined) {
    return next();
  } else {
    req.flash("fail", "로그인하지 않은 사용자만 접근할 수 있습니다.");
    return res.redirect("/");
  }
};

export const privateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.isLoggedIn === true) {
    return next();
  } else {
    req.flash("fail", "로그인한 사용자만 접근할 수 있습니다.");
    return res.redirect("/login");
  }
};

export const crossOriginMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Access-Control-Allow-Origin", "https://youtube-gw.herokuapp.com");
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};

export const avatarMulterMiddleware: multer.Multer = multer({
  dest: "uploads/avatars",
  limits: { fileSize: 20000000 },
  storage: process.env.NODE_ENV === "production" ? multerS3({ s3, bucket: "youtube-gw-bucket/avatars", acl: "public-read" }) : undefined,
});

export const videoMulterMiddleware = multer({
  dest: "uploads/videos",
  limits: { fileSize: 50000000 },
  storage: process.env.NODE_ENV === "production" ? multerS3({ s3, bucket: "youtube-gw-bucket/videos", acl: "public-read" }) : undefined,
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const handleDeleteFileFromAWS = (req: any, res: Response, next: NextFunction) => {
  const { file } = req;
  console.log("avatarUrl", file);

  if (file === undefined) {
    return next();
  }

  s3.deleteObject({
    Bucket: "youtube-gw-bucket",
    Key: `avatars/${file.key}`,
  });

  return next();
};
