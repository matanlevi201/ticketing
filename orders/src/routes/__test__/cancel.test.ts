import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { OrderStatus } from "@mlgittix/common";
import { Order } from "../../models/order";

it("returns 404 if an order was not found", async () => {
  const fakeOrderId = new mongoose.Types.ObjectId();

  await request(app)
    .patch(`/api/orders/${fakeOrderId}`)
    .set("Cookie", global.signin())
    .expect(404);
});

it("returns 401 if an order does not belong to current user", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const { body: orderBody } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${orderBody.id}`)
    .set("Cookie", global.signin())
    .expect(401);
});

it("marks an order as cancelled", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: orderBody } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${orderBody.id}`)
    .set("Cookie", user)
    .expect(200);

  const updatedOrder = await Order.findById(orderBody.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emit an event on order cancelletion");
