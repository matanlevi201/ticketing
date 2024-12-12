import request from "supertest";
import { app } from "../../app";

it("returns a 200 on successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns a 400 on email does not exists", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "emailDoesNotExists",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 on no matching passwords", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "noMatch",
    })
    .expect(400);
});

it("returns a 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "invalid_email",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with missing email or password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "email@email.com" })
    .expect(400);
  return request(app)
    .post("/api/users/signin")
    .send({ password: "validpassword" })
    .expect(400);
});
