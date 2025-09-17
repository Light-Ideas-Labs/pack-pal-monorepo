"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedMetrics = void 0;
const model_1 = __importDefault(require("../modules/models/metrics/model"));
const agridex_seed_data_json_1 = __importDefault(require("./agridex_seed_data.json"));
const seedMetrics = async (logger) => {
    try {
        logger.info("Seeding Metrics....");
        const metrics = agridex_seed_data_json_1.default.metrics;
        for (const item of metrics) {
            await model_1.default.create(item);
        }
        logger.info("Metrics seeded.");
    }
    catch (error) {
        logger.error("Error seeding X:", error);
    }
};
exports.seedMetrics = seedMetrics;
