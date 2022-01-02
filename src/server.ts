import express, { Request, Response } from "express";

const PORT = 4000;
const app = express();

app.get("/", (req: Request, res: Response) => {
  return res.send("Home");
});

app.get("/login", (req: Request, res: Response) => {
  return res.send("Login");
});

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
