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
exports.upsertTokenomics = exports.getTokenomics = void 0;
const TokenomicsService = __importStar(require("../services/tokenomics.service"));
// Todo tokenomics - tokenomics, tokenomics analysis, 
// Todo: tokenomics report, tokenomics model, tokenomics example, tokenomics research, tokenomics whitepaper, 
// tokenomics calculator, tokenomics chart, tokenomics data - etherscan, bscscan, polygonscan, etherscan api, bscscan api, polygonscan api
const getTokenomics = async (req, res) => {
    const { projectId } = req.params;
    const tokenomics = await TokenomicsService.getTokenomicsByProjectId(projectId);
    res.json(tokenomics);
};
exports.getTokenomics = getTokenomics;
const upsertTokenomics = async (req, res) => {
    const { projectId } = req.params;
    const updated = await TokenomicsService.createOrUpdateTokenomics(projectId, req.body);
    res.json(updated);
};
exports.upsertTokenomics = upsertTokenomics;
