import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import type { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { optionalAuth } from "./middlewares/auth.middleware";
import { NotFoundError, errorHandler, syntaxError, removeFavicon, handleErrorsMiddleware, } from "./middlewares/errorHandler";

// import routes v1
import { routeV1 } from './routes/index'

// api requests limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const app: Express = express();

/** Allow dev and prod origins */
const allowedOrigins = new Set<string>([
    "https://packpal.travel", // Production frontend with HTTPS
    "http://localhost:3000",
    "http://localhost:3001", // Local frontend
    "https://your-ngrok-url", // Ngrok for local testing
]);

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    // allow same-origin / server-to-server (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "x-guest-id"],
  credentials: true,
};

// ───── global non-error middlewares ────────────────────────────────
app.use(removeFavicon); // remove favicon requests
app.use(cors(corsOptions));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(limiter);
app.use(express.json());

// define the health check route
// app.get('/health', async (req: Request, res: Response): Promise<void> => {
//   try {
//       // Check MongoDB connection status
//       const mongoStatus: boolean = mongoose.connection.readyState === 1;

//       // ToDo: Assuming checkRedisConnection returns a Promise that resolves to a boolean

//       if (mongoStatus) {
//           res.status(200).json({ status: 'healthy' });
//       } else {
//           res.status(503).json({ status: 'unhealthy' });
//       }
//   } catch (error: unknown) {
//       // Typing error as unknown, which is safer in TypeScript
//       const errorMessage: string = (error instanceof Error) ? error.message : 'Unknown error';
//       res.status(503).json({ status: 'unhealthy', error: errorMessage });
//   }
// });

// testing api
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "PackPal API is running...",
  });
});

app.use(optionalAuth); // optional auth for all routes below
app.use(routeV1) // routing v1

// ───── global error middlewares ──────────────────────────────────
app.use(NotFoundError);            // ───── 404 for unmatched routes (must be after all routes)
app.use(syntaxError);             // 1) syntax errors (bad JSON, etc.)  // ───── error-handling chain (order matters)
app.use(handleErrorsMiddleware);  // 2) common Mongoose/validation errors with friendly messages
app.use(errorHandler);            // 3) final logger + fallback (includes req.user?.email logging)


export default app;