"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWatchlist = exports.removeFromWatchlist = exports.addToWatchlist = void 0;
const model_1 = __importDefault(require("../models/watchlist/model"));
const addToWatchlist = async (userId, projectId) => {
    try {
        return await model_1.default.findOneAndUpdate({ userId, projectId }, {}, { upsert: true, new: true });
    }
    catch (error) {
        console.error("Error adding to watchlist:", error);
        throw new Error("Failed to add to watchlist");
    }
};
exports.addToWatchlist = addToWatchlist;
const removeFromWatchlist = async (userId, projectId) => {
    try {
        return await model_1.default.findOneAndDelete({ userId, projectId });
    }
    catch (error) {
        console.error("Error removing from watchlist:", error);
        throw new Error("Failed to remove from watchlist");
    }
};
exports.removeFromWatchlist = removeFromWatchlist;
const getUserWatchlist = async (userId) => {
    try {
        return await model_1.default.find({ userId }).populate('projectId');
    }
    catch (error) {
        console.error("Error fetching user watchlist:", error);
        throw new Error("Failed to fetch user watchlist");
    }
};
exports.getUserWatchlist = getUserWatchlist;
