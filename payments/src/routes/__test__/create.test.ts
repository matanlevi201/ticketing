import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@mlgittix/common";
import { paymentService } from "../../payment-service";
import { Payment } from "../../models/payment";

// When working with my own mocked version
// jest.mock("../../payment-service");

it("return a 404 when purchasing an order that does not exists", async () => {
  await request(app)
    .post("/api/payments")
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
    .post("/api/payments")
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
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "fake_stripe_token",
      orderId: order.id,
    })
    .expect(400);
});

it("it returns 204 when charge was successful", async () => {
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
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(204);

  const recentCharges = await paymentService.charges.list({ limit: 50 });
  const targetCharge = recentCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  expect(targetCharge).toBeDefined();
  expect(targetCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    purchaseId: targetCharge!.id,
  });

  expect(payment).not.toBeNull();

  // When working with my own mocked version
  // const chargeOptions = (paymentService.charges.create as jest.Mock).mock
  //   .calls[0][0];
  // expect(chargeOptions.source).toEqual("tok_visa");
  // expect(chargeOptions.amount).toEqual(20 * 100);
  // expect(chargeOptions.currency).toEqual("usd");
});
