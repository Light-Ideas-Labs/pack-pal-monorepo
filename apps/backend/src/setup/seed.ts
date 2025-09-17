import mongoose, { ConnectOptions } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import { seedProjects } from './projects.migrate'
import { seedListings } from './listings.migrate';
import { seedNews } from './news.migrate';
import { seedProjectHistories } from './project.histories.migrate';
import { seedMetrics } from './metrics.migrate';
import { seedSubmissions } from './submissions.migrate';
import { seedTokenomics } from './tokenomics.migrate';
import { seedWatchlists } from './watchlists.migrate';


import { winstonLogger, pinoLogger } from "../middlewares/logger";
import type { AppLogger } from '../middlewares/logger';

const logOption: string = process.env.LOGGER || "winston";
const logger: AppLogger = logOption === "pino" ? pinoLogger : winstonLogger;

const mongoDBUrl: string = process.env.PRO_MONGO_URI || process.env.DEV_MONGO_URI!;
const mongoDBOptions: ConnectOptions = {
  socketTimeoutMS: 30000,
  maxPoolSize: 50,
  autoIndex: false,
  serverSelectionTimeoutMS: 20000,
};

const seed = async (): Promise<void> => {
  try {
    logger.info("Connecting to database...");
    await mongoose.connect(mongoDBUrl, mongoDBOptions);
    logger.info("Connected to MongoDB");

    logger.info("Starting the seeding process...");

    logger.info("Seeding projects...");
    await seedProjects(logger);

    logger.info("Seeding listings...");
    await seedListings(logger);

    logger.info("Seeding news...");
    await seedNews(logger);

    logger.info("Seeding project histories...");
    await seedProjectHistories(logger);

    logger.info("Seeding metrics...");
    await seedMetrics(logger);

    logger.info("Seeding submissions...");
    await seedSubmissions(logger);

    logger.info("Seeding tokenomics...");
    await seedTokenomics(logger);

    logger.info("Seeding watchlists...");
    await seedWatchlists(logger);

    logger.info("✅ All seeding operations completed successfully");
  } catch (error) {
    logger.error("❌ Error during seeding process:", error);
  } finally {
    logger.info("Closing database connection...");
    await mongoose.connection.close();
    logger.info("Database connection closed");
  }
};

(async (): Promise<void> => {
  try {
    await seed();
  } catch (error) {
    console.error("Seeding script failed:", error);
    logger.error("Seeding script failed:", error);
  }
})();
