import express, { Router } from "express";
import { createSubscription, cancelSubscription, expireSubscription, getEntitlement, verifySubscription } from "../../modules/controllers/subscription.controller";

const router: Router = express.Router();

router.post("/", createSubscription);
router.delete("/:id", cancelSubscription);
router.patch("/:id/expire", expireSubscription);
router.get("/:userId/entitlement", getEntitlement);
router.post("/verify", verifySubscription);

export default router;