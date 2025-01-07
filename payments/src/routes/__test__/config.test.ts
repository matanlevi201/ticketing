import request from "supertest";
import { app } from "../../app";

it("retrive the payment service publishable key", async () => {
  const response = await request(app)
    .get("/api/payments/config")
    .set("Cookie", global.signin())
    .send();

  expect(response.body.publishableKey).toEqual(process.env.PUB_STRIPE_KEY);
});
