import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from "@mlgittix/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { queueWrapper } from "../queue-wrapper";

const router = express.Router();
const validations = [
  body("title").trim().not().isEmpty().withMessage("Title must be valid"),
  body("price")
    .trim()
    .isFloat({ gt: 0 })
    .not()
    .isEmpty()
    .withMessage("Price must be valid"),
];

router.put(
  "/api/tickets/:id",
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    if (ticket.orderId) {
      throw new BadRequestError("Cannot update reserved ticket");
    }
    ticket.set({ title, price });
    await ticket.save();
    new TicketUpdatedPublisher(queueWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
    });
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
