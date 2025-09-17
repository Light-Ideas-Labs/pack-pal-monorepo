"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectHistory = exports.saveProjectSnapshot = void 0;
const model_1 = __importDefault(require("../models/project-history/model"));
const saveProjectSnapshot = async (data) => {
    return await model_1.default.create(data);
};
exports.saveProjectSnapshot = saveProjectSnapshot;
const getProjectHistory = async (projectId, days = 30) => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return await model_1.default.find({
        projectId,
        timestamp: { $gte: since },
    }).sort({ timestamp: 1 });
};
exports.getProjectHistory = getProjectHistory;
