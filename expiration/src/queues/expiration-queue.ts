import Queue from "bull";
import ExpirationCompletePulisher from "../events/pulishers/expiration-complete-publisher";
import { queueWrapper } from "../queue-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePulisher(queueWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
