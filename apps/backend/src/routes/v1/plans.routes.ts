import express, { Router } from 'express';
import { listPublicPlans, getPlanByName, createNewPlan, deletePlanName, deletePlanById, upsertPlanHandler, createFeatureMatrixHandler, upsertFeatureMatrixHandler, deleteFeatureMatrixHandler, linkFeatureMatrixHandler } from '../../modules/controllers/plans.controller';

const router: Router = express.Router();


// Plans (public reads)
router.get("/plans", listPublicPlans);
router.get("/plans/:planName", getPlanByName); // (free|pro|teams)

// Plans (admin)
router.post(
  "/",
  // requireAuth, requireAdmin,
  createNewPlan
);


router.put(
  "/",
  // requireAuth, requireAdmin,
  upsertPlanHandler
);


router.delete(
  "/:planName",
  // requireAuth, requireAdmin,
  deletePlanName
); // (free|pro|teams)


router.delete(
  "/id/:planId",
  // requireAuth, requireAdmin,
  deletePlanById
);


router.post(
  "/feature-matrices",
  // requireAuth, requireAdmin,
  createFeatureMatrixHandler
);


router.put(
  "/feature-matrices",
  // requireAuth, requireAdmin,
  upsertFeatureMatrixHandler
);


router.delete(
  "/feature-matrices/:matrixId",
  // requireAuth, requireAdmin,
  deleteFeatureMatrixHandler
);

/**
 * Link/unlink a FeatureMatrix to a plan (by plan name).
 * To UNLINK, pass the literal string "null" for :matrixId.
 * e.g. PATCH /plans/pro/feature-matrix/null
 */
router.patch(
  "/:planName/feature-matrix/:matrixId",
  // requireAuth, requireAdmin,
  linkFeatureMatrixHandler
);  // (free|pro|teams)

export default router;