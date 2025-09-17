import asyncHandler from "express-async-handler";
import { RequestHandler, Request, Response } from 'express';
import { listPublic, getByName, createPlan, deletePlanByName, deletePlanById as deleteById, upsertPlan, createFeatureMatrix, upsertFeatureMatrix, deleteFeatureMatrix, linkFeatureMatrixToPlan, } from '../services/plans.service';

const PLAN_NAMES = ['free', 'pro', 'teams'] as const;
type PlanName = typeof PLAN_NAMES[number];

function isPlanName(v: unknown): v is PlanName {
  return typeof v === 'string' && (PLAN_NAMES as readonly string[]).includes(v);
}

// List all public plans
const listPublicPlans: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        const plans = await listPublic();
        res.status(200).json({
            success: true,
            message: 'Public plans retrieved successfully',
            data: plans,
        });
    } catch (error: any) {
        console.log("Error listing public plans:", error);
        res.status(500).json({
            success: false,
            message: 'Error listing public plans',
            error: error.message,
        });
    }
  });

// Get plan by name
const getPlanByName: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.params.planName;
  try {
    
    if (!isPlanName(raw)) {
        res.status(400).json({
            success: false,
            message: "Invalid plan name. Allowed: 'free', 'pro', 'teams'.",
        });
        return;
    }
    
    const plan = await getByName(raw);
      if (!plan) {
          res.status(404).json({
              success: false,
                message: 'Plan not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Plan retrieved successfully',
            data: plan,
        });
    } catch (error: any) {
        console.log("Error getting plan by name:", error);
        res.status(500).json({
            success: false,
            message: 'Error getting plan',
            error: error.message,
        });
    }
});

// Create a new plan (admin only)
const createNewPlan: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const planData = req.body;
    try {
        const newPlan = await createPlan(planData);
        res.status(201).json({
            success: true,
            message: 'Plan created successfully',
            data: newPlan,
        });
    } catch (error: any) {
        console.log("Error creating plan:", error);
        res.status(500).json({
            success: false,
            message: 'Error creating plan',
            error: error.message,
        });
    }
});

// Delete plan by name (admin only)
const deletePlanName: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const raw = req.params.planName;
    try {
        if (!isPlanName(raw)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan name. Allowed: 'free', 'pro', 'teams'.",
            });
            return;
        }
        
        const deleted = await deletePlanByName(raw);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Plan not found',
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            message: 'Plan deleted successfully',
        });
    } catch (error: any) {
        console.log("Error deleting plan by name:", error);
        res.status(500).json({
            success: false,
            message: 'Error deleting plan',
            error: error.message,
        });
    }
});

// Delete plan by ID (admin only)
const deletePlanById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;
    try {
        const deleted = await deleteById(planId);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Plan not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Plan deleted successfully',
        });
    } catch (error: any) {
        console.log("Error deleting plan by ID:", error);
        res.status(500).json({
            success: false,
            message: 'Error deleting plan',
            error: error.message,
        });
    }
});

// Upsert (create or update) a plan (admin only)
const upsertPlanHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const planData = req.body;
    try {
        const upsertedPlan = await upsertPlan(planData);
        res.status(200).json({
            success: true,
            message: 'Plan upserted successfully',
            data: upsertedPlan,
        });
    } catch (error: any) {
        console.log("Error upserting plan:", error);
        res.status(500).json({
            success: false,
            message: 'Error upserting plan',
            error: error.message,
        });
    }
});

// Create a new feature matrix (admin only)
const createFeatureMatrixHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const matrixData = req.body;
    try {
        const newMatrix = await createFeatureMatrix(matrixData);
        res.status(201).json({
            success: true,
            message: 'Feature matrix created successfully',
            data: newMatrix,
        });
    } catch (error: any) {
        console.log("Error creating feature matrix:", error);
        res.status(500).json({
            success: false,
            message: 'Error creating feature matrix',
            error: error.message,
        });
    }
});

// Upsert (create or update) a feature matrix (admin only)
const upsertFeatureMatrixHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const matrixData = req.body;
    try {
        const upsertedMatrix = await upsertFeatureMatrix(matrixData);
        res.status(200).json({
            success: true,
            message: 'Feature matrix upserted successfully',
            data: upsertedMatrix,
        });
    } catch (error: any) {
        console.log("Error upserting feature matrix:", error);
        res.status(500).json({
            success: false,
            message: 'Error upserting feature matrix',
            error: error.message,
        });
    }
});

// Delete feature matrix by ID (admin only)
const deleteFeatureMatrixHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { matrixId } = req.params;
    try {
        const deleted = await deleteFeatureMatrix(matrixId);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Feature matrix not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Feature matrix deleted successfully',
        });
    } catch (error: any) {
        console.log("Error deleting feature matrix:", error);
        res.status(500).json({
            success: false,
            message: 'Error deleting feature matrix',
            error: error.message,
        });
    }
});

// Link a feature matrix to a plan (admin only)
const linkFeatureMatrixHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { planName, matrixId } = req.params;
    try {
        if (!isPlanName(planName)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan name. Allowed: 'free', 'pro', 'teams'.",
            });
            return;
        }

        const linkedPlan = await linkFeatureMatrixToPlan(planName, matrixId);
        if (!linkedPlan) {
            res.status(404).json({
                success: false,
                message: 'Plan or Feature Matrix not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Feature matrix linked to plan successfully',
            data: linkedPlan,
        });
    } catch (error: any) {
        console.log("Error linking feature matrix to plan:", error);
        res.status(500).json({
            success: false,
            message: 'Error linking feature matrix to plan',
            error: error.message,
        });
    }
});

export {
    listPublicPlans,
    getPlanByName,
    createNewPlan,
    deletePlanName,
    deletePlanById,
    upsertPlanHandler,
    createFeatureMatrixHandler,
    upsertFeatureMatrixHandler,
    deleteFeatureMatrixHandler,
    linkFeatureMatrixHandler
}



