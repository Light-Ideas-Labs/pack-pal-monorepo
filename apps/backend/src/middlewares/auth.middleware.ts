import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { getUserById } from "../modules/services/users.service";
import { env } from "../config/envConfig";

type Decoded = { sub: string };

const GUEST_COOKIE = "guest_sid";
const guestCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

/** Util: ensure a guest session id exists (cookie + req.guestSessionId) */
function ensureGuestSession(req: Request, res: Response): string {
  let sid = req.cookies?.[GUEST_COOKIE] as string | undefined;
  if (!sid) {
    sid = crypto.randomUUID();
    res.cookie(GUEST_COOKIE, sid, guestCookieOptions);
  }
  req.guestSessionId = sid;
  return sid;
}

/** Strict: requires a valid access token */
const requireAuth: RequestHandler = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken || req.headers["authorization"];
  if (typeof token === "string" && token.startsWith("Bearer ")) token = token.slice(7);

  if (!token) {
    res.status(401).json({ success: false, errorMessage: "Unauthenticated request. Token not provided!" });
    return;
  }
  if (!env.JWT_SECRET) {
    res.status(500).json({ success: false, errorMessage: "Server misconfigured (missing JWT secret)." });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as Decoded;
    const user = await getUserById(decoded.sub);
    if (!user) {
      res.status(404).json({ success: false, errorMessage: "User not found!" });
      return;
    }
    req.user = user; // you already augment Express.User to your UserDocument
    next();
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      res.status(401).json({ success: false, errorMessage: "Token expired. Please sign in again." });
      return;
    }
    res.status(400).json({ success: false, errorMessage: "Invalid token." });
  }
});

/** Soft: sets req.user if token present; otherwise continues silently */
const optionalAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  let token = req.cookies?.accessToken || req.headers["authorization"];
  if (typeof token === "string" && token.startsWith("Bearer ")) token = token.slice(7);
  if (!token || !env.JWT_SECRET) return next();

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as Decoded;
    const user = await getUserById(decoded.sub);
    if (user) req.user = user;
  } catch {
    // ignore – we’re optional
  }
  next();
});

/** Allow either a signed-in user OR create/use a guest session */
const requireUserOrGuest: RequestHandler = asyncHandler(async (req, res, next) => {
  if (req.user) return next();
  ensureGuestSession(req, res);
  next();
});

/** Role guards (use lower-case roles: 'admin' | 'staff' | 'customer') */
const authorizeRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized!" });
      return;
    }
    const role = (req.user as any).role?.toLowerCase?.() || "customer";
    if (!roles.map(r => r.toLowerCase()).includes(role)) {
      res.status(403).json({ error: "Access denied!" });
      return;
    }
    next();
  };

/** Example subscription gate */
const authorizedSubscribers: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized!" });
    return;
  }
  const role = (req.user as any).role?.toLowerCase?.();
  const active = req.user.subscription?.status === "active";
  if (!active && role !== "admin") {
    res.status(402).json({ error: "Subscribe to access this resource." });
    return;
  }
  next();
};

export { 
  requireAuth, 
  optionalAuth, 
  requireUserOrGuest, 
  authorizeRoles, 
  authorizedSubscribers 
};