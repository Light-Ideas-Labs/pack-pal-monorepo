"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkClient = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_2 = require("@clerk/express");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
exports.clerkClient = (0, express_2.createClerkClient)({
    secretKey: process.env.CLERK_SECRET_KEY,
});
// import routes v1
const index_1 = require("./routes/index");
// api requests limit
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        "https://coinlist.africa", // Production frontend with HTTPS
        "http://localhost:3000", // Local frontend
        "https://your-ngrok-url", // Ngrok for local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_2.clerkMiddleware)());
app.use(limiter);
// define the health check route
app.get('/health', async (req, res) => {
    try {
        // Check MongoDB connection status
        const mongoStatus = mongoose_1.default.connection.readyState === 1;
        // ToDo: Assuming checkRedisConnection returns a Promise that resolves to a boolean
        if (mongoStatus) {
            res.status(200).json({ status: 'healthy' });
        }
        else {
            res.status(503).json({ status: 'unhealthy' });
        }
    }
    catch (error) {
        // Typing error as unknown, which is safer in TypeScript
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(503).json({ status: 'unhealthy', error: errorMessage });
    }
});
// testing api
app.get("/", (req, res, next) => {
    res.status(200).json({
        succcess: true,
        message: "Coinlist Africa API is working",
    });
});
app.use(index_1.routeV1); // routing v1
exports.default = app;
