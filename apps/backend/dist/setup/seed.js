"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const projects_migrate_1 = require("./projects.migrate");
const listings_migrate_1 = require("./listings.migrate");
const news_migrate_1 = require("./news.migrate");
const project_histories_migrate_1 = require("./project.histories.migrate");
const metrics_migrate_1 = require("./metrics.migrate");
const submissions_migrate_1 = require("./submissions.migrate");
const tokenomics_migrate_1 = require("./tokenomics.migrate");
const watchlists_migrate_1 = require("./watchlists.migrate");
const logger_1 = require("../middlewares/logger");
const logOption = process.env.LOGGER || "winston";
const logger = logOption === "pino" ? logger_1.pinoLogger : logger_1.winstonLogger;
const mongoDBUrl = process.env.PRO_MONGO_URI || process.env.DEV_MONGO_URI;
const mongoDBOptions = {
    socketTimeoutMS: 30000,
    maxPoolSize: 50,
    autoIndex: false,
    serverSelectionTimeoutMS: 20000,
};
const seed = async () => {
    try {
        logger.info("Connecting to database...");
        await mongoose_1.default.connect(mongoDBUrl, mongoDBOptions);
        logger.info("Connected to MongoDB");
        logger.info("Starting the seeding process...");
        logger.info("Seeding projects...");
        await (0, projects_migrate_1.seedProjects)(logger);
        logger.info("Seeding listings...");
        await (0, listings_migrate_1.seedListings)(logger);
        logger.info("Seeding news...");
        await (0, news_migrate_1.seedNews)(logger);
        logger.info("Seeding project histories...");
        await (0, project_histories_migrate_1.seedProjectHistories)(logger);
        logger.info("Seeding metrics...");
        await (0, metrics_migrate_1.seedMetrics)(logger);
        logger.info("Seeding submissions...");
        await (0, submissions_migrate_1.seedSubmissions)(logger);
        logger.info("Seeding tokenomics...");
        await (0, tokenomics_migrate_1.seedTokenomics)(logger);
        logger.info("Seeding watchlists...");
        await (0, watchlists_migrate_1.seedWatchlists)(logger);
        logger.info("✅ All seeding operations completed successfully");
    }
    catch (error) {
        logger.error("❌ Error during seeding process:", error);
    }
    finally {
        logger.info("Closing database connection...");
        await mongoose_1.default.connection.close();
        logger.info("Database connection closed");
    }
};
(async () => {
    try {
        await seed();
    }
    catch (error) {
        console.error("Seeding script failed:", error);
        logger.error("Seeding script failed:", error);
    }
})();
