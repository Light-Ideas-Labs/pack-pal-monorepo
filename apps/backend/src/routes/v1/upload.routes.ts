import express, { Router } from 'express';
import { saveSnapshot, getProjectHistory, } from '../../modules/controllers/projectHistory.controller';

const router: Router = express.Router();


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
router.post('/snapshot', saveSnapshot);

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
router.get('/:projectId', getProjectHistory);

export default router;


