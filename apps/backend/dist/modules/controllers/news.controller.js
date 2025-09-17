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
exports.createNews = exports.getNews = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const NewsService = __importStar(require("../services/news.service"));
// Todo rss feed - coinTelegram, bitke, coindesk, cryptopanic
// Todo news sentiment analysis - sentiment analysis, news sentiment analysis, news sentiment analysis api, news sentiment analysis python, news sentiment analysis tool, news sentiment analysis example, news sentiment analysis github, news sentiment analysis dataset
const getNews = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const news = await NewsService.getNewsByProjectId(projectId);
    res.json(news);
});
exports.getNews = getNews;
const createNews = (0, express_async_handler_1.default)(async (req, res) => {
    const created = await NewsService.createNews(req.body);
    res.status(201).json(created);
});
exports.createNews = createNews;
