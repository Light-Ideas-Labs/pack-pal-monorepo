"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetricsByProjectId = exports.upsertMetricsByProjectId = void 0;
const model_1 = __importDefault(require("../models/metrics/model"));
const upsertMetricsByProjectId = async (projectId, data) => {
    return await model_1.default.findOneAndUpdate({ projectId }, data, { upsert: true, new: true });
};
exports.upsertMetricsByProjectId = upsertMetricsByProjectId;
const getMetricsByProjectId = async (projectId) => {
    return await model_1.default.findOne({ projectId });
};
exports.getMetricsByProjectId = getMetricsByProjectId;
