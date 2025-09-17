"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submission_controller_1 = require("../../modules/controllers/submission.controller");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/submissions:
 *   post:
 *     tags:
 *       - Submissions
 *     summary: Submit a new project for review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project submitted successfully
 */
router.post('/', submission_controller_1.submitProject);
/**
 * @openapi
 * /api/v1/submissions/pending:
 *   get:
 *     tags:
 *       - Submissions
 *     summary: Get all pending project submissions
 *     responses:
 *       200:
 *         description: List of pending submissions
 */
router.get('/pending', submission_controller_1.getPendingSubmissions);
/**
 * @openapi
 * /api/v1/submissions/{submissionId}:
 *   patch:
 *     tags:
 *       - Submissions
 *     summary: Review a project submission
 *     parameters:
 *       - in: path
 *         name: submissionId
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
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Submission reviewed
 */
router.patch('/:submissionId', submission_controller_1.reviewSubmission);
exports.default = router;
