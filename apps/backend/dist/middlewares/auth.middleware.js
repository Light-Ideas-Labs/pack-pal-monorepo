"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizedSubscribers = exports.authorizedAdmin = exports.authorizeRoles = exports.isAuthenticated = exports.authenticateRequest = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_service_1 = require("../modules/services/users.service");
const errorHandler_1 = require("./errorHandler");
const envConfig_1 = require("../config/envConfig");
const authenticateRequest = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b;
    let auth = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token) || ((_b = req.headers["authorization"]) === null || _b === void 0 ? void 0 : _b.toString());
    console.log("Auth header or cookie:", auth);
    if (auth) {
        auth = auth.replace("Bearer ", "");
        if (!envConfig_1.env.JWT_SECRET) {
            console.error("JWT_SECRET_KEY is missing in environment variables.");
            res.status(500).json({
                success: false,
                errorMessage: "Internal server error. Missing secret key.",
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(auth, envConfig_1.env.JWT_SECRET);
            console.log("Decoded token:", decoded);
            const user = await (0, users_service_1.getUserById)(decoded.sub);
            if (!user) {
                console.warn("User not found with decoded ID:", decoded.sub);
                return next(new errorHandler_1.ErrorHandler("User not found!", 404));
            }
            // convert to plain object
            req.user = user;
            next();
        }
        catch (error) {
            console.error("JWT verification error:", error);
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({
                    success: false,
                    errorMessage: "Token has expired. Please log in again!",
                });
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(400).json({
                    success: false,
                    errorMessage: "Invalid token. Authentication failed!",
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    errorMessage: "An error occurred during authentication!",
                });
            }
        }
    }
    else {
        console.log("No token provided in request (either cookies or authorization header)");
        res.status(401).json({ error: "Unauthenticated request. Token not provided!" });
    }
});
exports.authenticateRequest = authenticateRequest;
const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        console.log("Unauthorized access attempt without user in request.");
        res.status(401).json({ error: "Unauthorized!" });
        return;
    }
    next();
};
exports.isAuthenticated = isAuthenticated;
const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        console.log("User object missing during role-based check.");
        res.status(401).json({ error: "Unauthorized!" });
        return;
    }
    if (!roles.includes(req.user.role)) {
        console.warn(`Forbidden: user role ${req.user.role} not in [${roles}]`);
        res.status(403).json({ error: "Access denied!" });
        return;
    }
    next();
};
exports.authorizeRoles = authorizeRoles;
const authorizedAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "Admin") {
        res.status(403).json({ error: "Unauthorized request" });
        return;
    }
    next();
};
exports.authorizedAdmin = authorizedAdmin;
const authorizedSubscribers = (req, res, next) => {
    var _a;
    if (!req.user) {
        console.warn("User object missing for subscription check.");
        res.status(401).json({ error: "Unauthorized!" });
        return;
    }
    if (((_a = req.user.subscription) === null || _a === void 0 ? void 0 : _a.status) !== "active" &&
        req.user.role !== "Admin") {
        console.warn("Non-subscribed access attempt.");
        res
            .status(402)
            .json({ error: "You must subscribe to access this resource." });
        return;
    }
    next();
};
exports.authorizedSubscribers = authorizedSubscribers;
