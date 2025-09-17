"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserProject = exports.addUserProject = exports.promoteUserRole = exports.deleteUser = exports.updateUser = exports.listUsers = exports.getUser = exports.createUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const UserService = __importStar(require("../services/users.service"));
const createUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { firstName, lastName, email, password, avatar, gender, website, picture } = req.body;
        const user = await UserService.createUser({ firstName, lastName, email, avatar, gender, website, picture }, password);
        res.status(201).json({
            message: 'User created or retrieved',
            data: user
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.createUser = createUser;
const getUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userId } = req.params;
        const User = await UserService.getUserById(userId);
        res.status(200).json({
            success: true,
            message: 'User data retrieved successfuly',
            data: User
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching user',
            error
        });
    }
});
exports.getUser = getUser;
const listUsers = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({
            message: 'Users retrieved',
            data: users
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving users',
            error
        });
    }
});
exports.listUsers = listUsers;
const updateUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userId } = req.params;
        const update = req.body;
        const user = await UserService.updateUserById(userId, update);
        res.status(200).json({
            message: 'User updated',
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating user', error
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userId } = req.params;
        await UserService.deleteUserById(userId);
        res.status(200).json({
            su: true,
            message: 'User deleted successfuly',
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error
        });
    }
});
exports.deleteUser = deleteUser;
const promoteUserRole = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const user = await UserService.updateUserById(userId, { userType: role });
        res.status(200).json({
            message: `User promoted to ${role}`,
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error promoting user role',
            error
        });
    }
});
exports.promoteUserRole = promoteUserRole;
const addUserProject = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userId } = req.params;
        const { projectId } = req.body;
        const updatedUser = await UserService.addProjectToUser(userId, projectId);
        res.status(200).json({
            message: 'Project added to user',
            data: updatedUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error adding project to user',
            error
        });
    }
});
exports.addUserProject = addUserProject;
const removeUserProject = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userId } = req.params;
        const { projectId } = req.body;
        const updatedUser = await UserService.removeProjectFromUser(userId, projectId);
        res.status(200).json({
            message: 'Project removed from user',
            data: updatedUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error removing project from user',
            error
        });
    }
});
exports.removeUserProject = removeUserProject;
