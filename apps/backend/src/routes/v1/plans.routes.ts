import express, { Router } from 'express';
import { listPublicPlans, getPlanByName, createNewPlan, deletePlanName, deletePlanById, upsertPlanHandler, createFeatureMatrixHandler, upsertFeatureMatrixHandler, deleteFeatureMatrixHandler, linkFeatureMatrixHandler } from '../../modules/controllers/plans.controller';
import { requireAuth, authorizeRoles, requireUserOrGuest } from '../../middlewares/auth.middleware';

const router: Router = express.Router();

// Plans (public reads)
router.get("/plans", listPublicPlans);
router.get("/plans/:planName", getPlanByName); // (free|pro|teams)

// Plans (admin)
router.post("/", requireAuth, authorizeRoles("admin"), createNewPlan);
router.put("/", requireAuth, authorizeRoles("admin"), upsertPlanHandler);
router.delete("/:planName", requireAuth, authorizeRoles("admin"), deletePlanName); // (free|pro|teams)
router.delete("/id/:planId", requireAuth, authorizeRoles("admin"), deletePlanById);
router.post("/feature-matrices", requireAuth, authorizeRoles("admin"), createFeatureMatrixHandler);
router.put("/feature-matrices", requireAuth, authorizeRoles("admin"), upsertFeatureMatrixHandler);
router.delete("/feature-matrices/:matrixId", requireAuth, authorizeRoles("admin"), deleteFeatureMatrixHandler);

/**
 * Link/unlink a FeatureMatrix to a plan (by plan name).
 * To UNLINK, pass the literal string "null" for :matrixId.
 * e.g. PATCH /plans/pro/feature-matrix/null
 */
router.patch("/:planName/feature-matrix/:matrixId", requireAuth, authorizeRoles("admin"), linkFeatureMatrixHandler);  // (free|pro|teams)

export default router;