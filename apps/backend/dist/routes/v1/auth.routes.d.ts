import { Router } from "express";
declare const router: Router;
/**
 * @openapi
 * /api/v1/auth/social-auth:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Social authentication
 *     responses:
 *       200:
 *         description: User authenticated via social login
 */
export default router;
