import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { queueWrapper } from "../../queue-wrapper"; // jest would make sure we import our mock version
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "title", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "title", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "updated_title", price: 100 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 100 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ price: 100 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "valid_title", price: -100 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "valid_title" })
    .expect(400);
});

it("update the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  const ticketPayload = { title: "title", price: 100 };
  const updateTicketPayload = { title: "updated_title", price: 10 };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticketPayload);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(updateTicketPayload)
    .expect(200);

  const updatedTicket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(updatedTicket.body.title).toEqual(updateTicketPayload.title);
  expect(updatedTicket.body.price).toEqual(updateTicketPayload.price);
});

it("pulishes an event", async () => {
  const cookie = global.signin();
  const ticketPayload = { title: "title", price: 100 };
  const updateTicketPayload = { title: "updated_title", price: 10 };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticketPayload);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(updateTicketPayload)
    .expect(200);

  expect(queueWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if ticket is reserved", async () => {
  const cookie = global.signin();
  const ticketPayload = { title: "title", price: 100 };
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticketPayload);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId });
  await ticket!.save();

  const updateTicketPayload = { title: "updated_title", price: 10 };
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(updateTicketPayload)
    .expect(400);
});
