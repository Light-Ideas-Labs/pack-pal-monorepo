"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedWatchlists = void 0;
const model_1 = __importDefault(require("../modules/models/watchlist/model"));
const agridex_seed_data_json_1 = __importDefault(require("./agridex_seed_data.json"));
const seedWatchlists = async (logger) => {
    try {
        logger.info("Seeding X...");
        const watchlists = agridex_seed_data_json_1.default.watchlists;
        for (const item of watchlists) {
            await model_1.default.create(item);
        }
        logger.info("Seeding X finished.");
    }
    catch (error) {
        logger.error("Error seeding X:", error);
    }
};
exports.seedWatchlists = seedWatchlists;
