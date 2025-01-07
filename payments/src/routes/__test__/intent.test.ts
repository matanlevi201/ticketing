import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@mlgittix/common";
import { paymentService } from "../../payment-service";

it("return a 404 when purchasing an order that does not exists", async () => {
  await request(app)
    .post("/api/payments/intent")
    .set("Cookie", global.signin())
    .send({
      token: "fake_stripe_token",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("return a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments/intent")
    .set("Cookie", global.signin())
    .send({
      token: "fake_stripe_token",
      orderId: order.id,
    })
    .expect(401);
});

it("return a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments/intent")
    .set("Cookie", global.signin(userId))
    .send({
      token: "fake_stripe_token",
      orderId: order.id,
    })
    .expect(400);
});

it("return a 400 when purchasing a completed order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Complete,
  });
  await order.save();

  await request(app)
    .post("/api/payments/intent")
    .set("Cookie", global.signin(userId))
    .send({
      token: "fake_stripe_token",
      orderId: order.id,
    })
    .expect(400);
});

it("create payment intent and return client secret", async () => {
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

  const response = await request(app)
    .post("/api/payments/intent")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id });

  expect(response.body.clientSecret).toBeDefined();

  const clientSecret = response.body.clientSecret;
  const paymentIntentId = clientSecret.split("_secret_")[0];
  let paymentIntent;
  try {
    const { amount, status } = await paymentService.paymentIntents.retrieve(
      paymentIntentId
    );
    paymentIntent = { amount, status };
  } catch (error) {}

  expect(paymentIntent!.amount).toEqual(order.price * 100);
  expect(paymentIntent!.status).toEqual("requires_payment_method");
});
