import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const localsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log("localsMiddleware", req.session.loggedInUser, req.session.isLoggedIn);
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
    return res.redirect("/");
  }
};

export const privateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.isLoggedIn === true) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const multerMiddleware: multer.Multer = multer({ dest: "uploads/" });
