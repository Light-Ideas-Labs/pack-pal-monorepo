import express, { Router } from "express";
import { signUp, activateUserAccount, signIn, signOut, sendVerificationEmail, verifyEmailAccount, refreshToken, forgotPasswordLink, newPassword, changePassword } from "../../modules/controllers/auth.controller";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post('/signup', signUp);

/**
 * @openapi
 * /api/v1/auth/activate-account:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Activate user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account activated successfully
 */
router.post('/activate-account', activateUserAccount);

/**
 * @openapi
 * /api/v1/auth/signin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User signin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 */
router.post('/signin', signIn);

/**
 * @openapi
 * /api/v1/auth/signout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User signout
 *     responses:
 *       200:
 *         description: User signed out successfully
 */
router.post('/signout', signOut);

/**
 * @openapi
 * /api/v1/auth/send-verification-email:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 */

router.post('/send-verification-email', sendVerificationEmail);

/**
 * @openapi
 * /api/v1/auth/verify-email:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify user email
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.get('/verify-email', verifyEmailAccount);

/**
 * @openapi
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh user token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */

router.post('/refresh-token', refreshToken);

/**
 * @openapi
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send forgot password link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Forgot password link sent successfully
 */
router.post('/forgot-password', forgotPasswordLink);

/**
 * @openapi
 * /api/v1/auth/new-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Set new password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.post('/new-password/:token', newPassword);

/**
 * @openapi
 * /api/v1/auth/change-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Change user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/change-password', changePassword);

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
// router.post('/social-auth', socialAuth);

export default router;