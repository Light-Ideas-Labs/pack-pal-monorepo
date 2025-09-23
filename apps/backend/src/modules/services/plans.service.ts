import { Types, isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";
import PlanModel from "../models/plan/model";
import { FeatureMatrix as FeatureMatrixModel }  from "../models/feature-matrix/model";
import { ApiError } from "../../middlewares/errorHandler";

export type PlanName = 'free' | 'pro' | 'teams';
export type Interval = "monthly" | "yearly";

type Price = { interval: Interval; amount: number; currency: string; subtitle?: string; badge?: string };

function assertPriceCents(prices?: Price[]) {
  if (!Array.isArray(prices)) return;
  for (const p of prices) {
    if (!Number.isInteger(p.amount)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "`prices.amount` must be integer cents");
    }
    if (p.interval !== "monthly" && p.interval !== "yearly") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "`prices.interval` must be 'monthly' or 'yearly'");
    }
    if (!p.currency) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "`prices.currency` is required");
    }
  }
}

/** List all plans, with optional features expanded. Sorted by order asc. */
const listPublic = async (expandFeatures = true) => {
  try {
    const plans = await PlanModel.find().sort({ order: 1 }).lean();

    if (!expandFeatures) return plans;

    const fmIds = plans.map((p: any) => p.featureMatrixRef).filter(Boolean);
    const matrices = await FeatureMatrixModel.find({ _id: { $in: fmIds } }).lean();
    const byId = new Map(matrices.map((m: any) => [String(m._id), m]));

    return plans.map((p: any) => ({
      ...p,
      features: p.featureMatrixRef ? byId.get(String(p.featureMatrixRef))?.items ?? [] : [],
    }));
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to list public plans");
  }
};

/** PUBLIC: get a plan by name with features */
const getByName = async (name: PlanName) => {
  try {
    const plan = await PlanModel.findOne({ name }).lean();
    if (!plan) throw new ApiError(StatusCodes.NOT_FOUND, "Plan not found");

    const features =
      plan.featureMatrixRef
        ? (await FeatureMatrixModel.findById(plan.featureMatrixRef).lean())?.items ?? []
        : [];

    return { ...plan, features };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get plan");
  }
};

/** ADMIN: create a plan (no upsert). Fails if name exists. */
const createPlan = async (data: any) => {
  try {
    const name: PlanName | undefined = data?.name;
    if (!name) throw new ApiError(StatusCodes.BAD_REQUEST, "`name` is required (free|pro|teams)");

    const exists = await PlanModel.findOne({ name }).lean();
    if (exists) throw new ApiError(StatusCodes.CONFLICT, "Plan with this name already exists");

    assertPriceCents(data.prices);

    const created = await PlanModel.create(data);
    return created.toObject();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    // handle dup key nicely
    if (error?.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, "Duplicate plan name");
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create plan");
  }
};

/** ADMIN: delete a plan by name (safe helper) */
const deletePlanByName = async (name: PlanName) => {
  try {
    const deleted = await PlanModel.findOneAndDelete({ name }).lean();
    if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, "Plan not found");
    return deleted;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete plan");
  }
};

/** ADMIN: delete a plan by id (when managing custom/experimental plans) */
const deletePlanById = async (id: string | Types.ObjectId) => {
  try {
    if (!isValidObjectId(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid plan id");
    const deleted = await PlanModel.findByIdAndDelete(id).lean();
    if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, "Plan not found");
    return deleted;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete plan");
  }
};

/** ADMIN: upsert a plan (seeders / admin). Validates price cents. */
const upsertPlan = async (data: any) => {
  try {
    const name: PlanName = data?.name;
    if (!name) throw new ApiError(StatusCodes.BAD_REQUEST, "`name` is required");

    assertPriceCents(data.prices);

    const updated = await PlanModel.findOneAndUpdate({ name }, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    return updated.toObject();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to upsert plan");
  }
};

/** ADMIN: create FeatureMatrix (always create new doc) */
const createFeatureMatrix = async (items: Array<{ label: string; tiers: Record<string, string> }>) => {
  try {
    const created = await FeatureMatrixModel.create({ items });
    return created._id as Types.ObjectId;
  } catch {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create feature matrix");
  }
};

/** ADMIN: upsert a single FeatureMatrix document (if you want exactly one) */
const upsertFeatureMatrix = async (items: Array<{ label: string; tiers: Record<string, string> }>) => {
  try {
    const existing = await FeatureMatrixModel.findOne();
    if (!existing) {
      const created = await FeatureMatrixModel.create({ items });
      return created._id as Types.ObjectId;
    }
    existing.items = items as any;
    await existing.save();
    return existing._id as Types.ObjectId;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to upsert feature matrix");
  }
};

/** ADMIN: delete FeatureMatrix (optionally block if referenced) */
const deleteFeatureMatrix = async (matrixId: string | Types.ObjectId, { failIfLinked = true } = {}) => {
  try {
    if (!isValidObjectId(matrixId)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid feature matrix id");

    if (failIfLinked) {
      const linked = await PlanModel.findOne({ featureMatrixRef: matrixId }).select("_id name").lean();
      if (linked) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          `Feature matrix is linked to plan '${linked.name}'. Unlink before deleting.`
        );
      }
    }

    const deleted = await FeatureMatrixModel.findByIdAndDelete(matrixId).lean();
    if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, "Feature matrix not found");
    return deleted;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete feature matrix");
  }
};

/** ADMIN: link/unlink FeatureMatrix to a plan */
const linkFeatureMatrixToPlan = async (planName: PlanName, matrixId: string | Types.ObjectId | null) => {
  try {
    if (matrixId !== null && !isValidObjectId(matrixId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid feature matrix id");
    }
    const updated = await PlanModel.findOneAndUpdate(
      { name: planName },
      { featureMatrixRef: matrixId },
      { new: true }
    ).lean();
    if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, "Plan not found");
    return updated;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to link feature matrix to plan");
  }
};

export {
  // public
  listPublic,
  getByName,
  // admin
  createPlan,
  deletePlanByName,
  deletePlanById,
  upsertPlan,
  createFeatureMatrix,
  upsertFeatureMatrix,
  deleteFeatureMatrix,
  linkFeatureMatrixToPlan,
};
