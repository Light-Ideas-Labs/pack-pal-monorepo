"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTokenomics = void 0;
const model_1 = __importDefault(require("../modules/models/tokenomics/model"));
const agridex_seed_data_json_1 = __importDefault(require("./agridex_seed_data.json"));
const seedTokenomics = async (logger) => {
    try {
        logger.info("Seeding X...");
        const tokenomics = agridex_seed_data_json_1.default.tokenomics;
        for (const item of tokenomics) {
            await model_1.default.create(item);
        }
        logger.info("Seeding X finished.");
    }
    catch (error) {
        logger.error("Error seeding X:", error);
    }
};
exports.seedTokenomics = seedTokenomics;
