import mongoose from "mongoose";

import { app } from "./app";
import { queueWrapper } from "./queue-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  console.log("Starting up ...");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.DB_URI) {
    throw new Error("DB_URI must be defined");
  }
  if (!process.env.QUEUE_CLIENT_ID) {
    throw new Error("QUEUE_CLIENT_ID must be defined");
  }
  if (!process.env.QUEUE_URL) {
    throw new Error("QUEUE_URL must be defined");
  }
  if (!process.env.QUEUE_CLUSTER_ID) {
    throw new Error("QUEUE_CLUSTER_ID must be defined");
  }

  try {
    await queueWrapper.connect(
      process.env.QUEUE_CLUSTER_ID,
      process.env.QUEUE_CLIENT_ID,
      process.env.QUEUE_URL
    );
    queueWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => queueWrapper.client.close());
    process.on("SIGTERM", () => queueWrapper.client.close());
    new OrderCreatedListener(queueWrapper.client).listen();
    new OrderCancelledListener(queueWrapper.client).listen();
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
