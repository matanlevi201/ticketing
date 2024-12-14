import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@mlgittix/common";

import { createTicketRouter } from "./routes/create-ticket";
import { findTicketRouter } from "./routes/find-ticket";
import { allTicketsRouter } from "./routes/tickets";
import { updateTicketRouter } from "./routes/update-ticket";

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
app.use(createTicketRouter);
app.use(findTicketRouter);
app.use(allTicketsRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
