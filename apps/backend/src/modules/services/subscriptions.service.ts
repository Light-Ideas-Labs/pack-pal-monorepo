import { Types, isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../middlewares/errorHandler";
import SubscriptionModel from '../models/subscription/model';
import { PlanName } from './plans.service';

export type Provider = 'google_play' | 'stripe' | 'manual' | 'paypal' | 'exion';
export type SubStatus = 'active' | 'canceled' | 'expired' | 'in_grace';

const ensureObjectId = (v: string | Types.ObjectId, field = "id"): Types.ObjectId => {
  if (typeof v === "string") {
    if (!isValidObjectId(v)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid ${field}`);
    }
    return new Types.ObjectId(v);
  }
  return v;
};


  /** Create a subscription record after verifying with provider. */
const create = async   (opts: {userId: string | Types.ObjectId; plan: PlanName; provider: Provider; productId: string; purchaseToken: string; startAt?: Date; renewsAt?: Date;  raw?: any; }) => {
    try {
    // placeholder: verify with provider here
    // await this.verifyWithProvider(opts.provider, opts.productId, opts.purchaseToken);
    const userId = ensureObjectId(opts.userId, "userId");
    
    // Verify with external provider (stubbed)
    const ver = await verifyWithProvider(opts.provider, opts.productId, opts.purchaseToken);
    if (!ver?.ok) {
        throw new ApiError(StatusCodes.PAYMENT_REQUIRED, "Unable to verify purchase");
    }

    const doc = await SubscriptionModel.create({
      userId,
      plan: opts.plan,
      provider: opts.provider,
      productId: opts.productId,
      purchaseToken: opts.purchaseToken,
      status: 'active',
      startAt: opts.startAt ?? new Date(),
      renewsAt: opts.renewsAt,
      raw: opts.raw ?? {},
    });
    return doc.toObject();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create subscription");
    }
  }

const markCanceled = async (id: string | Types.ObjectId, when = new Date()) =>  { 
    try {
    const doc = await SubscriptionModel.findByIdAndUpdate(
      id,
      { status: 'canceled', canceledAt: when },
      { new: true }
    ).lean();
    if (!doc) throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription not found');
    return doc;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to mark subscription as canceled");
    }
  }

const markExpired = async(id: string | Types.ObjectId) => {
    try     {
    if (!isValidObjectId(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid subscription id");
    const doc = await SubscriptionModel.findByIdAndUpdate(
      id,
      { status: 'expired' },
      { new: true }
    ).lean();
    if (!doc) throw new ApiError(StatusCodes.NOT_FOUND, "Subscription not found");
    return doc;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to mark subscription as expired");
    }
  }



const getUserEntitlement = async (userId: string | Types.ObjectId): Promise<{plan: PlanName; status: SubStatus; subscription?: any;}> => {
    try{
    
    const sub = await SubscriptionModel.findOne({
      userId: ensureObjectId(userId, 'userId'),
      status: { $in: ['active', 'in_grace'] },
    })
      .sort({ updatedAt: -1 })
      .lean();

    if (!sub) return { plan: 'free', status: 'expired' };

    return { plan: sub.plan as PlanName, status: sub.status as SubStatus, subscription: sub };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get user entitlement");
    }
  }

  /** Provider verification stub (replace with Google/Stripe SDK calls). */
const verifyWithProvider = async (provider: Provider, productId: string, purchaseToken: string) => {
    try{
    // Implement:
    // - Google Play Developer API (purchases.subscriptions.get)
    // - Stripe Subscriptions API
    // - Your Exion/PayPal flow
    // Throw AppError on invalid/expired tokens
    return { ok: true, provider, productId, purchaseToken };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to verify with provider");
    }
  }


export {
    create,
    markCanceled,
    markExpired,
    getUserEntitlement,
    verifyWithProvider
}
