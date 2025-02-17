import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.DB_URI) {
    throw new Error("DB_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("service is listening on port 3000");
  });
};

start();
