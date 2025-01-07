import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
} from "@mlgittix/common";
import { Order } from "../models/order";
import { paymentService } from "../payment-service";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/pulishers/payment-created-publisher";
import { queueWrapper } from "../queue-wrapper";

const router = express.Router();
const getValidations = () => [body("orderId").not().isEmpty()];
router.post(
  "/api/payments/intent",
  requireAuth,
  getValidations(),
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order is already cancelled");
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("Order is already complete");
    }
    const paymentIntent = await paymentService.paymentIntents.create({
      currency: "usd",
      amount: order.price * 100,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  }
);

export { router as createPaymentIntent };
