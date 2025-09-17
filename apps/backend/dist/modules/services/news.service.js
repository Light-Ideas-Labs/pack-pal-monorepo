"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsByProjectId = exports.getAllNews = exports.createNews = void 0;
const model_1 = __importDefault(require("../models/news/model"));
const createNews = async (data) => {
    return await model_1.default.create(data);
};
exports.createNews = createNews;
const getAllNews = async () => {
    return await model_1.default.find().sort({ publishedAt: -1 });
};
exports.getAllNews = getAllNews;
const getNewsByProjectId = async (projectId) => {
    return await model_1.default.find({ projectId }).sort({ publishedAt: -1 });
};
exports.getNewsByProjectId = getNewsByProjectId;
