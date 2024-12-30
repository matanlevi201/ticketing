import { OrderCancelledEvent } from "@mlgittix/common";
import { queueWrapper } from "../../../queue-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import OrderCancelledListener from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(queueWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: { id: ticket.id },
  };
  // make typescript ignore the msg object cause i only care for the ack function and not the rest of the properties inside the Message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, orderId };
};

it("unlocking the reserved ticket", async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(queueWrapper.client.publish).toHaveBeenCalled();
});
