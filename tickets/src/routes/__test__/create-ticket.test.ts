import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { queueWrapper } from "../../queue-wrapper"; // jest would make sure we import our mock version

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ price: 10 })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "title", price: -10 })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "title" })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const allTicketsBefore = await Ticket.find({});
  expect(allTicketsBefore.length).toEqual(0);
  const ticketPayload = { title: "title", price: 20 };
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(ticketPayload)
    .expect(201);
  const allTicketsAfter = await Ticket.find({});
  expect(allTicketsAfter.length).toEqual(1);
  expect(allTicketsAfter[0].price).toEqual(ticketPayload.price);
  expect(allTicketsAfter[0].title).toEqual(ticketPayload.title);
});

it("pulishes an event", async () => {
  const ticketPayload = { title: "title", price: 20 };
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(ticketPayload)
    .expect(201);

  expect(queueWrapper.client.publish).toHaveBeenCalled();
});
