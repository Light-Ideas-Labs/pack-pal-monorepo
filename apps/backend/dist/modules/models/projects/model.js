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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: String,
    region: String, // east africa, west africa, south africa, north africa, central africa
    country: String,
    chainDeployedTo: [String], // e.g. ethereum, bsc, polygon, solana, avalanche, fantom, arbitrum, optimism, base, zksync
    tokenSymbol: String,
    website: String,
    communityLinks: [String], // telegram, discord, twitter, reddit, facebook, instagram, farcaster
    exchangeLinks: [String], // binance, coinbase, kraken, kucoin, huobi, okex, gateio
    whitepaperLink: String,
    tokenAddress: String,
    tags: [String],
    listedAt: Date,
    isActive: Boolean,
    logoUrl: String,
    keyBackers: [String], // Todo: get data from coingecko, coinmarketcap, etherscan, bscscan, polygonscan - accelerator, venture capital, angel investors, private equity, hedge funds, family offices, sovereign wealth funds
    aiInsights: {
        summary: String,
        newsLinks: [String],
        sentimentScore: Number
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Project', ProjectSchema);
