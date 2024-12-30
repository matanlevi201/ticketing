import OrderCreatedListener from "./events/listeners/order-created-listener";
import { queueWrapper } from "./queue-wrapper";

const start = async () => {
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
  } catch (err) {
    console.error(err);
  }
};

start();
