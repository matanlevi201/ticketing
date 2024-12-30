import { ExpirationCompleteEvent, OrderStatus } from "@mlgittix/common";
import { queueWrapper } from "../../../queue-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new ExpirationCompleteListener(queueWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // make typescript ignore the msg object cause i only care for the ack function and not the rest of the properties inside the Message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, order };
};

it("updates the order status to cancelled", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit order cancelled event", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  expect(queueWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (queueWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});
it("ack the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
