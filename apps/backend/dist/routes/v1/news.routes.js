"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const news_controller_1 = require("../../modules/controllers/news.controller");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/news:
 *   post:
 *     tags:
 *       - News
 *     summary: Create a news article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: News created
 */
router.post('/', news_controller_1.createNews);
/**
 * @openapi
 * /api/v1/news/{projectId}:
 *   get:
 *     tags:
 *       - News
 *     summary: Get news for a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News retrieved
 */
router.get('/:projectId', news_controller_1.getNews);
exports.default = router;
