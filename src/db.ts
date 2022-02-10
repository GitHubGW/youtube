import mongoose from "mongoose";

mongoose.connect(process.env.DATABASE_URL as string);

const mongooseConnection: mongoose.Connection = mongoose.connection;

mongooseConnection.on("connected", (): void => {
  console.log("🚀 Connected to DB");
});

mongooseConnection.on("error", (error): void => {
  console.log("❌ DB Error", error);
});
