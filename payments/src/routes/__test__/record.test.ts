import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@mlgittix/common";
import { paymentService } from "../../payment-service";
import { Payment } from "../../models/payment";

it("returns 404 if order was not found", async () => {
  await request(app)
    .post("/api/payments/record")
    .set("Cookie", global.signin())
    .send({
      paymentIntentId: "fake_payment_id",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("return a 401 when purchasing an order that does not belong to the user", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post("/api/payments/record")
    .set("Cookie", global.signin())
    .send({
      paymentIntentId: "fake_payment_id",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 if payment intent does not exists", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post("/api/payments/record")
    .set("Cookie", global.signin(userId))
    .send({
      paymentIntentId: "fake_payment_id",
      orderId: order.id,
    })
    .expect(400);
});

it("does not create a payment record when intent was cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  const paymentIntent = await paymentService.paymentIntents.create({
    amount: price,
    currency: "usd",
    payment_method_types: ["card"],
  });

  try {
    await paymentService.paymentIntents.confirm(paymentIntent.id, {
      payment_method: "pm_card_chargeDeclined",
    });
  } catch (error) {
    // Expected error
  }

  const response = await request(app)
    .post("/api/payments/record")
    .set("Cookie", global.signin(userId))
    .send({
      paymentIntentId: paymentIntent.id,
      orderId: order.id,
    });

  const createdPayment = await Payment.findById(response.body.paymentId);
  expect(createdPayment).toBeNull();
});

it("it returns 204 when payment was successful and create a payment record", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  const paymentIntent = await paymentService.paymentIntents.create({
    amount: price,
    currency: "usd",
    payment_method_types: ["card"],
  });

  await paymentService.paymentIntents.confirm(paymentIntent.id, {
    payment_method: "pm_card_visa",
  });

  const response = await request(app)
    .post("/api/payments/record")
    .set("Cookie", global.signin(userId))
    .send({
      paymentIntentId: paymentIntent.id,
      orderId: order.id,
    })
    .expect(201);

  const createdPayment = await Payment.findById(response.body.paymentId);
  const updatedOrder = await Order.findById(order.id);

  expect(paymentIntent.amount).toEqual(order.price);
  expect(createdPayment!.orderId).toEqual(order.id);
  expect(createdPayment!.purchaseId).toEqual(paymentIntent.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});
