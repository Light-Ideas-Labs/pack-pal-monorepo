"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const watchlist_controller_1 = require("../../modules/controllers/watchlist.controller");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/watchlist:
 *   post:
 *     tags:
 *       - Watchlist
 *     summary: Add project to user's watchlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added to watchlist
 */
router.post('/', watchlist_controller_1.addToWatchlist);
/**
 * @openapi
 * /api/v1/watchlist/{userId}/{projectId}:
 *   delete:
 *     tags:
 *       - Watchlist
 *     summary: Remove a project from user's watchlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from watchlist
 */
router.delete('/:userId/:projectId', watchlist_controller_1.removeFromWatchlist);
/**
 * @openapi
 * /api/v1/watchlist/{userId}:
 *   get:
 *     tags:
 *       - Watchlist
 *     summary: Get user's watchlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's watchlist retrieved
 */
router.get('/:userId', watchlist_controller_1.getUserWatchlist);
exports.default = router;
