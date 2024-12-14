import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from "@mlgittix/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

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
    ticket.set({ title, price });
    await ticket.save();
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
