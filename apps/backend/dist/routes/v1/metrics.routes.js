"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const metrics_controller_1 = require("../../modules/controllers/metrics.controller");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/metrics/{projectId}:
 *   get:
 *     tags:
 *       - Metrics
 *     summary: Get project metrics
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Metrics fetched
 */
router.get('/:projectId', metrics_controller_1.getMetrics);
/**
 * @openapi
 * /api/v1/metrics/{projectId}:
 *   put:
 *     tags:
 *       - Metrics
 *     summary: Upsert project metrics
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Metrics upserted
 */
router.put('/:projectId', metrics_controller_1.upsertMetrics);
exports.default = router;
