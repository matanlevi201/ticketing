import express, { Request, Response } from "express";
import { requireAuth } from "@mlgittix/common";

const router = express.Router();

router.get(
  "/api/payments/config",
  requireAuth,
  async (req: Request, res: Response) => {
    res.send({ publishableKey: process.env.PUB_STRIPE_KEY });
  }
);

export { router as getConfigRouter };
