"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWatchlist = exports.removeFromWatchlist = exports.addToWatchlist = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const WatchlistService = __importStar(require("../services/watchlist.service"));
const addToWatchlist = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userId, projectId } = req.body;
        const entry = await WatchlistService.addToWatchlist(userId, projectId);
        res.status(201).json({ message: 'Project added to watchlist', data: entry });
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding to watchlist', error });
    }
});
exports.addToWatchlist = addToWatchlist;
const removeFromWatchlist = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        await WatchlistService.removeFromWatchlist(userId, projectId);
        res.status(200).json({ message: 'Project removed from watchlist' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing from watchlist', error });
    }
});
exports.removeFromWatchlist = removeFromWatchlist;
const getUserWatchlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const list = await WatchlistService.getUserWatchlist(userId);
        res.status(200).json({ message: 'User watchlist retrieved', data: list });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user watchlist', error });
    }
};
exports.getUserWatchlist = getUserWatchlist;
