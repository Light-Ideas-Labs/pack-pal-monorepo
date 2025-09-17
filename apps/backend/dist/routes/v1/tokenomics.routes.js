"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokenomics_controller_1 = require("../../modules/controllers/tokenomics.controller");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/tokenomics/{projectId}:
 *   get:
 *     tags:
 *       - Tokenomics
 *     summary: Get tokenomics data for a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tokenomics fetched successfully
 */
router.get('/:projectId', tokenomics_controller_1.getTokenomics);
/**
 * @openapi
 * /api/v1/tokenomics/{projectId}:
 *   put:
 *     tags:
 *       - Tokenomics
 *     summary: Create or update tokenomics for a project
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
 *             properties:
 *               supply:
 *                 type: number
 *               distribution:
 *                 type: object
 *     responses:
 *       200:
 *         description: Tokenomics upserted successfully
 */
router.put('/:projectId', tokenomics_controller_1.upsertTokenomics);
exports.default = router;
