"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedListings = void 0;
const model_1 = __importDefault(require("../modules/models/listing/model"));
const agridex_seed_data_json_1 = __importDefault(require("./agridex_seed_data.json"));
const seedListings = async (logger) => {
    try {
        logger.info("Seeding listing....");
        const listings = agridex_seed_data_json_1.default.listings;
        for (const item of listings) {
            await model_1.default.create(item);
        }
        logger.info("Project seeded.");
    }
    catch (error) {
        logger.error("Error seeding project histories:", error);
    }
};
exports.seedListings = seedListings;
