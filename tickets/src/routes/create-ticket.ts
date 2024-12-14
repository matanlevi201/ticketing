import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@mlgittix/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

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
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
