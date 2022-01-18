import { Request, Response, NextFunction } from "express";

export const localsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("localsMiddleware", req.session.loggedInUser, req.session.isLoggedIn);

  if (req.session.isLoggedIn === true) {
    res.locals.loggedInUser = req.session.loggedInUser;
    res.locals.isLoggedIn = req.session.isLoggedIn;
  }
  next();
};
