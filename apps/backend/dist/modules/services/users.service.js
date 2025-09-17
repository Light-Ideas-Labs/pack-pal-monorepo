"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProjectFromUser = exports.addProjectToUser = exports.deleteUserById = exports.updateUserById = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const model_1 = __importDefault(require("../models/users/model"));
const crypto_1 = __importDefault(require("crypto"));
const createUser = async (userData, plainPassword) => {
    try {
        const existingUser = await model_1.default.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User already exists with this email.");
        }
        // Generate salt and hashed password
        const salt = crypto_1.default.randomBytes(16).toString("hex");
        const hashed_password = crypto_1.default
            .createHmac("sha1", salt)
            .update(plainPassword)
            .digest("hex");
        // Create new user
        const newUser = new model_1.default(Object.assign(Object.assign({}, userData), { salt, password: hashed_password, projects: [], createdAt: new Date(), updatedAt: new Date() }));
        await newUser.save();
        return newUser;
    }
    catch (error) {
        console.log("Error creating or fetching user:", error);
        throw new Error("Error creating or fetching user");
    }
};
exports.createUser = createUser;
// Get all users
const getAllUsers = async () => {
    try {
        const users = await model_1.default.find().sort({ createdAt: -1 });
        return users;
    }
    catch (error) {
        console.log("Error fetching users:", error);
        throw new Error("Error fetching users");
    }
};
exports.getAllUsers = getAllUsers;
// Get user by _id
const getUserById = async (id) => {
    try {
        const user = await model_1.default.findById(id);
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (error) {
        console.log("Error fetching user:", error);
        throw new Error("Error fetching user");
    }
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    try {
        const user = await model_1.default.findOne({ email });
        return user;
    }
    catch (error) {
        console.log("Error fetching user by email:", error);
        throw new Error("Error fetching user by email");
    }
};
exports.getUserByEmail = getUserByEmail;
const updateUserById = async (id, data) => {
    try {
        // Check if the user exists
        const user = await model_1.default.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (error) {
        console.log("Error updating user:", error);
        throw new Error("Error updating user");
    }
};
exports.updateUserById = updateUserById;
// Delete user by Clerk ID
const deleteUserById = async (UserId) => {
    try {
        // Check if the user exists
        const user = await model_1.default.findOneAndDelete({ UserId });
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (error) {
        console.log("Error deleting user:", error);
        throw new Error("Error deleting user");
    }
};
exports.deleteUserById = deleteUserById;
// Add a project to user's profile
const addProjectToUser = async (clerkUserId, projectId) => {
    var _a;
    try {
        // Check if the user exists
        const user = await model_1.default.findOne({ clerkUserId });
        if (!user)
            throw new Error("User not found");
        // Check if the project already exists
        const projectExists = ((_a = user.projects) !== null && _a !== void 0 ? _a : []).some((project) => project.projectId === projectId);
        if (projectExists)
            throw new Error("Project already exists for this user");
        // Add the project to the user's projects array
        const updatedUser = await model_1.default.findOneAndUpdate({ clerkUserId }, { $addToSet: { projects: { projectId } } }, { new: true });
        if (!updatedUser)
            throw new Error("Failed to add project to user");
        return updatedUser;
    }
    catch (error) {
        console.log("Error adding project to user:", error);
        throw new Error("Error adding project to user");
    }
};
exports.addProjectToUser = addProjectToUser;
// Remove a project from user
const removeProjectFromUser = async (clerkUserId, projectId) => {
    var _a;
    try {
        // Check if the user exists
        const user = await model_1.default.findOne({ clerkUserId });
        if (!user)
            throw new Error("User not found");
        // Check if the project exists
        const projectExists = ((_a = user.projects) !== null && _a !== void 0 ? _a : []).some((project) => project.projectId === projectId);
        if (!projectExists)
            throw new Error("Project not found for this user");
        // Remove the project from the user's projects array
        const updatedUser = await model_1.default.findOneAndUpdate({ clerkUserId }, { $pull: { projects: { projectId } } }, { new: true });
        if (!updatedUser)
            throw new Error("Failed to remove project from user");
        return updatedUser;
    }
    catch (error) {
        console.log("Error removing project from user:", error);
        throw new Error("Error removing project from user");
    }
};
exports.removeProjectFromUser = removeProjectFromUser;
