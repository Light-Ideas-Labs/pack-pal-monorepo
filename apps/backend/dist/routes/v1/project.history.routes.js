"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectHistory_controller_1 = require("../../modules/controllers/projectHistory.controller");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/project-history/snapshot:
 *   post:
 *     tags:
 *       - Project History
 *     summary: Save a snapshot of a project's history
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Snapshot saved
 */
router.post('/snapshot', projectHistory_controller_1.saveSnapshot);
/**
 * @openapi
 * /api/v1/project-history/{projectId}:
 *   get:
 *     tags:
 *       - Project History
 *     summary: Get project history for a specific period
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Project history retrieved
 */
router.get('/:projectId', projectHistory_controller_1.getProjectHistory);
exports.default = router;
