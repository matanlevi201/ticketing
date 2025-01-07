import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@mlgittix/common";
import { getConfigRouter } from "./routes/config";
import { createPaymentIntent } from "./routes/intent";
import { recordPaymentRouter } from "./routes/record";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // UNIT TEST NOTE: supertest uses http protocol and 'secure: true' means its cookies will be shared only on https protocol
  })
);

app.use(currentUser);
app.use(getConfigRouter);
app.use(createPaymentIntent);
app.use(recordPaymentRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
