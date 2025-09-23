import { config } from "dotenv";
import { z } from "zod";

// Load correct .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
config({ path: envFile });

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),

  APP_NAME: z.string().default("CoinlistAfricaAPI"),
  APP_FRONTEND_URL: z.string().url({ message: "APP_FRONTEND_URL must be a valid URL" }).default("http://localhost:3000"),

  PRO_MONGO_URI: z.string().regex(/^mongodb(\+srv)?:\/\//, { message: "Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://", }),

  SMTP_EMAIL_USER: z.string().email({ message: "SMTP_EMAIL_USER must be a valid email address" }),
  SMTP_EMAIL_PASSWORD: z.string().min(6, "SMTP_EMAIL_PASSWORD must be at least 6 characters long"),
  SMTP_EMAIL_SERVICE: z.string().default("gmail"), // Default to Gmail, can be changed to other services like 'yahoo', 'outlook', etc.
  SMTP_EMAIL_HOST: z.string().default("smtp.gmail.com"),
  SMTP_EMAIL_PORT: z.coerce.number().default(465),

  EMAIL_SENDER_FROM: z.string().email({ message: "EMAIL_SENDER_FROM must be a valid email address" }).default("coinlistafrica@gmail.com"),

  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  RATE_LIMIT_WINDOW: z.coerce.number().default(15),      // in minutes
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  SENTRY_DSN: z.string().optional(), // Optional, can be set in production

  JWT_SECRET: z.string().min(10, "JWT_SECRET must be set and strong").default("your_jwt_secret_here"),

  JWT_ACCOUNT_ACTIVATION: z.string().default("your_account_activation_secret_here"),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(15),        // Number of minutes after which an access token expires
  JWT_REFRESH_TOKEN_EXPIRATION_DAYS: z.coerce.number().default(30),     // Number of days after which a refresh token expires
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number().default(10), // Number of minutes after which a reset password token expires
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce.number().default(10),   // Number of minutes after which a verify email token expires
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

// Safe to access PRO_MONGO_URI here
console.log("🔌 Connecting to MongoDB at:", parsed.data.PRO_MONGO_URI.split('@')[1].split('?')[0]);


export const env = {
  ...parsed.data,
  isDevelopment: parsed.data.NODE_ENV === "development",
  isProduction: parsed.data.NODE_ENV === "production",
  isTest: parsed.data.NODE_ENV === "test"
};