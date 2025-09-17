import asyncHandler from "express-async-handler";
import { RequestHandler, Request, Response } from 'express';
import { create, markCanceled, markExpired, getUserEntitlement, verifyWithProvider }  from '../services/subscriptions.service';

// Create a new subscription
const createSubscription: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const plan = req.body.plan;
    const provider = req.body.provider;
    const productId = req.body.productId;
    const purchaseToken = req.body.purchaseToken;

    const subscription = await create({
        userId,
        plan,
        provider,
        productId,
        purchaseToken
    });

    res.status(201).json(subscription);
});

// Mark a subscription as canceled
const cancelSubscription: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    const canceledSubscription = await markCanceled(subscriptionId);
    res.status(200).json(canceledSubscription);
});

// Mark a subscription as expired
const expireSubscription: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    const expiredSubscription = await markExpired(subscriptionId);
    res.status(200).json(expiredSubscription);
});

// Get user entitlement
const getEntitlement: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const entitlement = await getUserEntitlement(userId);
    res.status(200).json(entitlement);
});

// Verify subscription with provider
const verifySubscription: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { provider, productId, purchaseToken } = req.body;
    const verification = await verifyWithProvider(provider, productId, purchaseToken);
    res.status(200).json(verification);
});

export {
    createSubscription,
    cancelSubscription,
    expireSubscription,
    getEntitlement,
    verifySubscription
};