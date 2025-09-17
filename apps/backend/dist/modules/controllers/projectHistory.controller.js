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
exports.getProjectHistory = exports.saveSnapshot = void 0;
const ProjectHistoryService = __importStar(require("../services/project-history.service"));
const saveSnapshot = async (req, res) => {
    try {
        const snapshot = await ProjectHistoryService.saveProjectSnapshot(req.body);
        res.status(201).json({
            message: 'Snapshot saved',
            data: snapshot
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error saving snapshot',
            error
        });
    }
};
exports.saveSnapshot = saveSnapshot;
const getProjectHistory = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { days } = req.query;
        const history = await ProjectHistoryService.getProjectHistory(projectId, Number(days) || 30);
        res.status(200).json({
            message: 'Project history retrieved',
            data: history
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching project history',
            error
        });
    }
};
exports.getProjectHistory = getProjectHistory;
