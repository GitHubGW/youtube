import express, { NextFunction, Request, Response } from "express";

const PORT = 4000;
const app = express();

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("loggerMiddleware", req.method, req.url);
  next();
};

const privateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("privateMiddleware", req.url);

  if (req.url === "/protected") {
    return res.send("<h1>protected1</h1>");
  }

  next();
};

app.use(loggerMiddleware);
app.use(privateMiddleware);

app.get("/", (req: Request, res: Response) => {
  return res.send("<h1>home</h1>");
});

app.get("/protected", (req: Request, res: Response) => {
  return res.send("<h1>proteced2</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
