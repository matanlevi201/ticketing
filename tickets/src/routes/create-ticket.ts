import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@mlgittix/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { queueWrapper } from "../queue-wrapper";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

const router = express.Router();
const validations = [
  body("title").trim().not().isEmpty().withMessage("Title must be requried"),
  body("price")
    .trim()
    .isFloat({ gt: 0 })
    .not()
    .isEmpty()
    .withMessage("Price must be valid"),
];
router.post(
  "/api/tickets",
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();
    await new TicketCreatedPublisher(queueWrapper.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
