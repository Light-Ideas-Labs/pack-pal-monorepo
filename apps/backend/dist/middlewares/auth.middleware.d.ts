import { Request, Response, NextFunction } from "express";
declare const authenticateRequest: import("express").RequestHandler;
declare const isAuthenticated: (req: Request, res: Response, next: NextFunction) => void;
declare const authorizeRoles: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
declare const authorizedAdmin: (req: Request, res: Response, next: NextFunction) => void;
declare const authorizedSubscribers: (req: Request, res: Response, next: NextFunction) => void;
export { authenticateRequest, isAuthenticated, authorizeRoles, authorizedAdmin, authorizedSubscribers, };
