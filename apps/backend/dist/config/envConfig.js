"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
// Load correct .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
(0, dotenv_1.config)({ path: envFile });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("production"),
    APP_NAME: zod_1.z.string().default("CoinlistAfricaAPI"),
    APP_PORT: zod_1.z.coerce.number().default(4000),
    APP_FRONTEND_URL: zod_1.z.string().url({ message: "APP_FRONTEND_URL must be a valid URL" }).default("http://localhost:3000"),
    PRO_MONGO_URI: zod_1.z.string().regex(/^mongodb(\+srv)?:\/\//, { message: "Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://", }),
    SMTP_EMAIL_USER: zod_1.z.string().email({ message: "SMTP_EMAIL_USER must be a valid email address" }),
    SMTP_EMAIL_PASSWORD: zod_1.z.string().min(6, "SMTP_EMAIL_PASSWORD must be at least 6 characters long"),
    SMTP_EMAIL_SERVICE: zod_1.z.string().default("gmail"), // Default to Gmail, can be changed to other services like 'yahoo', 'outlook', etc.
    SMTP_EMAIL_HOST: zod_1.z.string().default("smtp.gmail.com"),
    SMTP_EMAIL_PORT: zod_1.z.coerce.number().default(465),
    EMAIL_SENDER_FROM: zod_1.z.string().email({ message: "EMAIL_SENDER_FROM must be a valid email address" }).default("coinlistafrica@gmail.com"),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:3000"),
    RATE_LIMIT_WINDOW: zod_1.z.coerce.number().default(15), // in minutes
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(100),
    SENTRY_DSN: zod_1.z.string().optional(), // Optional, can be set in production
    JWT_SECRET: zod_1.z.string().min(10, "JWT_SECRET must be set and strong").default("your_jwt_secret_here"),
    JWT_ACCOUNT_ACTIVATION: zod_1.z.string().default("your_account_activation_secret_here"),
    JWT_ACCESS_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(15), // Number of minutes after which an access token expires
    JWT_REFRESH_TOKEN_EXPIRATION_DAYS: zod_1.z.coerce.number().default(30), // Number of days after which a refresh token expires
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(10), // Number of minutes after which a reset password token expires
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(10), // Number of minutes after which a verify email token expires
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    process.exit(1);
}
// Safe to access PRO_MONGO_URI here
console.log("🔌 Connecting to MongoDB at:", parsed.data.PRO_MONGO_URI.split('@')[1].split('?')[0]);
exports.env = Object.assign(Object.assign({}, parsed.data), { isDevelopment: parsed.data.NODE_ENV === "development", isProduction: parsed.data.NODE_ENV === "production", isTest: parsed.data.NODE_ENV === "test" });
