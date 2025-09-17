import asyncHandler from "express-async-handler";
import { RequestHandler, Request, Response } from 'express';
import { getOrFetch, pruneExpiredRequirements } from '../services/travel.requirements.service';

const toStringArray = (v: unknown): string[] => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x));
  // allow comma-separated
  return String(v).split(",").map((s) => s.trim()).filter(Boolean);
};

const toBoolean = (v: unknown): boolean => {
  if (v == null) return false;
  const s = String(v).toLowerCase();
  return s === "true" || s === "1" || s === "yes";
};

// Get travel requirements
const getTravelRequirements: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const to = req.query.to as string;
    const citizenship = req.query.citizenship as string;
    const residence = req.query.residence as string | undefined;
    const transit: string[] = toStringArray(req.query.transit);
    const ttlDays = req.query.ttlDays ? parseInt(req.query.ttlDays as string, 10) : undefined;
    const forceRefresh = req.query.forceRefresh === 'true';
    if (!to || !citizenship) {
        res.status(400).json({
            success: false,
            message: "'to' and 'citizenship' query parameters are required.",
        });
        return;
    }

    const result = await getOrFetch({ to, citizenship, residence, transit, ttlDays, forceRefresh });
    res.status(200).json({
        success: true,
        cached: result.cached,
        data: result.data,
    });
});

const pruneTravelRequirements: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const prunedCount = await pruneExpiredRequirements();
    res.status(200).json({
        success: true,
        message: `Pruned ${prunedCount} expired travel requirements.`,
    });
});

export {
    getTravelRequirements,
    pruneTravelRequirements
};