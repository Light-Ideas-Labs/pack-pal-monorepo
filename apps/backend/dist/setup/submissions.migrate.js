"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSubmissions = void 0;
const model_1 = __importDefault(require("../modules/models/submissions/model"));
const agridex_seed_data_json_1 = __importDefault(require("./agridex_seed_data.json"));
const seedSubmissions = async (logger) => {
    try {
        logger.info("Seeding X...");
        const submissions = agridex_seed_data_json_1.default.submissions;
        for (const item of submissions) {
            await model_1.default.create(item);
        }
        logger.info("Seeding X finished.");
    }
    catch (error) {
        logger.error("Error seeding X:", error);
    }
};
exports.seedSubmissions = seedSubmissions;
