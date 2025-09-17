"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProjectHistories = void 0;
const model_1 = __importDefault(require("../modules/models/project-history/model"));
const agridex_seed_data_json_1 = __importDefault(require("./agridex_seed_data.json"));
const seedProjectHistories = async (logger) => {
    try {
        logger.info("Seeding X...");
        const histories = agridex_seed_data_json_1.default.projectHistories;
        for (const item of histories) {
            await model_1.default.create(item);
        }
        logger.info("Seeding X finished.");
    }
    catch (error) {
        logger.error("Error seeding X:", error);
    }
};
exports.seedProjectHistories = seedProjectHistories;
