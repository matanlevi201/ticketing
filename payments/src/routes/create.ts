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
  body("token").not().isEmpty(),
  body("orderId").not().isEmpty(),
];
router.post(
  "/api/payments",
  requireAuth,
  getValidations(),
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const charge = await paymentService.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({ orderId, purchaseId: charge.id });
    await payment.save();

    await new PaymentCreatedPublisher(queueWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      purchaseId: payment.purchaseId,
    });

    res.status(204).send({ paymentId: payment.id });
  }
);

export { router as createChargeRouter };
