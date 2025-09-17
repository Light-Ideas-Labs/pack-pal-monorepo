import express, { Router } from 'express';

import { createUser, getUser, listUsers, updateUser, deleteUser, promoteUserRole } from '../../modules/controllers/users.controller';

const router: Router = express.Router();

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
router.post('/', createUser);

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
router.get('/', listUsers);

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
router.get('/:userId', getUser);

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
router.put('/:userId', updateUser);

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
router.delete('/:userId', deleteUser);


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
router.post('/:userId/promote', promoteUserRole);



export default router;
