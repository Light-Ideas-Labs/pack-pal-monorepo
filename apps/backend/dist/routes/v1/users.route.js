"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../../modules/controllers/users.controller");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', users_controller_1.createUser);
/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', users_controller_1.listUsers);
/**
 * @openapi
 * /api/v1/users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/:userId', users_controller_1.getUser);
/**
 * @openapi
 * /api/v1/users/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user information
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:userId', users_controller_1.updateUser);
/**
 * @openapi
 * /api/v1/users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:userId', users_controller_1.deleteUser);
/**
 * @openapi
 * /api/v1/users/{userId}/promote:
 *   post:
 *     tags:
 *       - Users
 *     summary: Promote a user to another role
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               newRole:
 *                 type: string
 *     responses:
 *       200:
 *         description: User role updated
 */
router.post('/:userId/promote', users_controller_1.promoteUserRole);
/**
 * @openapi
 * /api/v1/users/{userId}/projects:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add a project to a user's profile
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project added to user
 */
router.post('/:userId/projects', users_controller_1.addUserProject);
/**
 * @openapi
 * /api/v1/users/{userId}/projects/{projectId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Remove a project from a user's profile
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
 *         description: Project removed from user
 */
router.delete('/:userId/projects/:projectId', users_controller_1.removeUserProject);
exports.default = router;
