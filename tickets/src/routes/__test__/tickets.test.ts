import request from "supertest";
import { app } from "../../app";

const createTicket = async function create(payload: {
  title: string;
  price: number;
}) {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(payload);
};

it("can fetch a list of all tickets", async () => {
  await createTicket({ title: "first_ticket", price: 10 });
  await createTicket({ title: "second_ticket", price: 20 });
  await createTicket({ title: "third_ticket", price: 30 });
  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.length).toEqual(3);
});
