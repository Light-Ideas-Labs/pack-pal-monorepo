"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.verifyEmail = exports.refreshAuth = exports.logout = exports.invalidateExistingTokens = exports.loginUserWithEmailAndPassword = void 0;
const model_1 = __importDefault(require("../models/users/model"));
const model_2 = __importDefault(require("../models/token/model"));
const constant_1 = require("../../utils/constant");
const token_service_1 = require("./token.service");
const users_service_1 = require("./users.service");
// Login with email and password
const loginUserWithEmailAndPassword = async (email, password) => {
    try {
        if (!email || !password) {
            const error = new Error('Email and password are required!');
            throw error;
        }
        const user = await (0, users_service_1.getUserByEmail)(email);
        if (!user) {
            // Distinct error for invalid email
            const error = new Error('Invalid email!');
            error.type = "invalid_email";
            throw error;
        }
        if (typeof user.authenticate !== 'function' || !user.authenticate(password)) {
            // Distinct error for invalid password
            const error = new Error('Invalid password!');
            error.type = "invalid_password";
            throw error;
        }
        return user;
    }
    catch (error) {
        console.log('Error during login:', error);
        throw error;
    }
};
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
// Invalidate existing tokens for user
const invalidateExistingTokens = async (userId) => {
    try {
        const result = await model_2.default.deleteMany({ user: userId });
        return result.deletedCount > 0;
    }
    catch (error) {
        console.error('Error invalidating tokens:', error);
        throw error;
    }
};
exports.invalidateExistingTokens = invalidateExistingTokens;
// Logout by revoking refresh token
const logout = async (refreshToken) => {
    const refreshTokenDoc = await model_2.default.findOne({
        token: refreshToken,
        type: constant_1.TOKEN_TYPES.REFRESH,
        blacklisted: false,
    });
    if (!refreshTokenDoc) {
        throw new Error('Refresh token not found!');
    }
    if (typeof refreshTokenDoc.deleteOne !== 'function') {
        throw new Error('Invalid refresh token document!');
    }
    await refreshTokenDoc.deleteOne();
};
exports.logout = logout;
// Refresh auth tokens
const refreshAuth = async (refreshToken) => {
    const refreshTokenDoc = await (0, token_service_1.verifyToken)(refreshToken, constant_1.TOKEN_TYPES.REFRESH);
    const user = await (0, users_service_1.getUserById)(refreshTokenDoc.user);
    if (!user) {
        throw new Error('User not found!');
    }
    if (typeof refreshTokenDoc.deleteOne === 'function') {
        await refreshTokenDoc.deleteOne();
    }
    return (0, token_service_1.generateAuthTokens)(user);
};
exports.refreshAuth = refreshAuth;
// Verify email token and mark user as verified
const verifyEmail = async (verifyEmailToken) => {
    const verifyEmailTokenDoc = await (0, token_service_1.verifyToken)(verifyEmailToken, constant_1.TOKEN_TYPES.VERIFY_EMAIL);
    const user = await (0, users_service_1.getUserById)(verifyEmailTokenDoc.user);
    if (!user) {
        throw new Error('User not found!');
    }
    const updateUserEmail = {
        isVerified: true,
        updatedBy: user.id,
    };
    await model_1.default.findOneAndUpdate({ _id: user.id }, updateUserEmail);
    await model_2.default.deleteMany({ user: user.id, type: constant_1.TOKEN_TYPES.VERIFY_EMAIL });
    return user;
};
exports.verifyEmail = verifyEmail;
// Reset password
const resetPassword = async (resetPasswordToken, newPassword) => {
    console.log(`Reset Password Token: ${resetPasswordToken}`);
    console.log(`New Password: ${newPassword}`);
    if (!resetPasswordToken) {
        throw new Error("Reset password token is missing!");
    }
    const resetTokenDoc = await (0, token_service_1.verifyToken)(resetPasswordToken, constant_1.TOKEN_TYPES.RESET_PASSWORD);
    const user = await (0, users_service_1.getUserById)(resetTokenDoc.user);
    if (!user) {
        throw new Error('User not found!');
    }
    await (0, users_service_1.updateUserById)(user.id, { password: newPassword });
    await model_2.default.deleteMany({ user: user.id, type: constant_1.TOKEN_TYPES.RESET_PASSWORD });
    return user;
};
exports.resetPassword = resetPassword;
// Change password
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await (0, users_service_1.getUserById)(userId);
    if (!user) {
        throw new Error('User not found!');
    }
    if (typeof user.authenticate !== 'function' || !user.authenticate(oldPassword)) {
        throw new Error('Old password is incorrect!');
    }
    await (0, users_service_1.updateUserById)(user.id, { password: newPassword });
    return user;
};
exports.changePassword = changePassword;
