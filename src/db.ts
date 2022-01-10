import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/youtube-portfolio");

const mongooseConnection: mongoose.Connection = mongoose.connection;

mongooseConnection.on("connected", (): void => {
  console.log("🚀 Connected to DB");
});

mongooseConnection.on("error", (error): void => {
  console.log("❌ DB Error", error);
});
