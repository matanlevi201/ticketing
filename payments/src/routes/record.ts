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

const getValidations = () => [
  body("paymentIntentId").not().isEmpty(),
  body("orderId").not().isEmpty(),
];
router.post(
  "/api/payments/record",
  requireAuth,
  getValidations(),
  validateRequest,
  async (req: Request, res: Response) => {
    const { paymentIntentId, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (!paymentIntentId) {
      throw new BadRequestError("Payment intent id must be provided");
    }

    let paymentIntent;
    try {
      paymentIntent = await paymentService.paymentIntents.retrieve(
        paymentIntentId
      );
    } catch (error) {
      throw new BadRequestError("Payment intent was not found");
    }

    if (paymentIntent.status !== "succeeded") {
      return res.send();
    }

    const payment = Payment.build({ orderId, purchaseId: paymentIntent.id });
    await payment.save();
    order.set({ status: OrderStatus.Complete });
    await order.save();
    await new PaymentCreatedPublisher(queueWrapper.client).publish({
      id: payment.id,
      orderId: order.id,
      purchaseId: payment.id,
    });

    res.status(201).send({ paymentId: payment.id });
  }
);

export { router as recordPaymentRouter };
