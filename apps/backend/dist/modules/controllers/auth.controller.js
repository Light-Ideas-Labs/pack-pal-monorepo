"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.newPassword = exports.forgotPasswordLink = exports.refreshToken = exports.verifyEmailAccount = exports.sendVerificationEmail = exports.signOut = exports.signIn = exports.activateUserAccount = exports.signUp = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("../../config/envConfig");
const email_service_1 = __importDefault(require("../common/email-service"));
const isTokenExpired_1 = __importDefault(require("../../utils/isTokenExpired"));
const users_service_1 = require("../services/users.service");
const sendToken_1 = require("../../utils/sendToken");
const auth_service_1 = require("../services/auth.service");
const token_service_1 = require("../services/token.service");
const signUp = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { firstName, lastName, email, password, avatar, gender, website, picture } = req.body;
        const user = await (0, users_service_1.getUserByEmail)(email);
        if (user) {
            res.status(400).json({
                error: `User with this Email ${email} already exists!`
            });
            return;
        }
        const userData = { firstName, lastName, email, password, avatar, gender, website, picture };
        const activationCodeAndToken = await (0, token_service_1.generateUserActivationCode)(userData);
        const data = {
            token: activationCodeAndToken.token,
            verificationCode: activationCodeAndToken.activationCode
        };
        console.log(`Activation Code: ${activationCodeAndToken.activationCode}`);
        await (0, email_service_1.default)(email, 'accountActivationLinkAndCode', firstName, data);
        res.status(200).json({
            success: true,
            message: `An activation code has been set to ${email}.`,
            activationToken: activationCodeAndToken.token
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred during sign up!'
        });
    }
});
exports.signUp = signUp;
const activateUserAccount = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { activation_code, activation_token } = req.body;
        const payload = jsonwebtoken_1.default.verify(activation_token, envConfig_1.env.JWT_SECRET);
        if (typeof payload !== "object" ||
            payload === null ||
            !("activationCode" in payload) ||
            !("user" in payload) ||
            typeof payload.user !== "object") {
            res.status(400).json({
                success: false,
                message: 'Invalid activation code or token!'
            });
            return;
        }
        if (payload.activationCode !== activation_code) {
            res.status(400).json({
                success: false,
                message: 'Invalid activation code or token!'
            });
            return;
        }
        const { firstName, lastName, email, password, avatar, gender, website, picture } = payload.user;
        const userExists = await (0, users_service_1.getUserByEmail)(email);
        if (userExists) {
            res.status(400).json({
                error: `User with this Email ${email} already exists!`
            });
            return;
        }
        const newUser = await (0, users_service_1.createUser)({ firstName, lastName, email, avatar, gender, website, picture, isVerified: true }, password);
        res.status(200).json({
            success: true,
            message: 'Your account has been verified successfully!'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Account activation failed.'
        });
    }
});
exports.activateUserAccount = activateUserAccount;
const signIn = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, auth_service_1.loginUserWithEmailAndPassword)(email, password);
        user.salt = undefined;
        user.password = undefined;
        await (0, auth_service_1.invalidateExistingTokens)(user.id);
        (0, sendToken_1.sendToken)(res, `Welcome Back ${user.firstName}!`, user, 200);
    }
    catch (error) {
        if (error.message === "Invalid email!") {
            res.status(401).json({ success: false, message: "No account found with that email address." });
        }
        if (error.message === "Invalid password!") {
            res.status(401).json({ success: false, message: "Password is incorrect." });
        }
        if (error.message === "Email and password are required!") {
            res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.signIn = signIn;
const signOut = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        res.clearCookie("access_token", sendToken_1.accessCookieOptions);
        res.clearCookie("refresh_token", sendToken_1.refreshCookieOptions);
        res.cookie("connect.sid", "", Object.assign(Object.assign({}, sendToken_1.accessCookieOptions), { maxAge: 1 }));
        res.status(200).json({
            success: true,
            message: 'Signed out successfully!'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sign out error.', error: error instanceof Error ? error.message : error
        });
    }
});
exports.signOut = signOut;
const sendVerificationEmail = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(400).json({ success: false, message: 'User ID not found in request.' });
            return;
        }
        const user = await (0, users_service_1.getUserById)(userId);
        const { token, activationCode } = await (0, token_service_1.generateVerifyEmailToken)(user);
        await (0, email_service_1.default)(user.email, 'account-activation-link', user.firstName, { token, activationCode });
        res.status(200).json({
            success: true,
            message: 'Check your email to verify your account!'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send email.', error: error instanceof Error ? error.message : error
        });
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const verifyEmailAccount = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const user = await (0, auth_service_1.verifyEmail)(req.query.token);
        await (0, email_service_1.default)(user.email, 'welcome to Coinlist Africa', user.firstName, {});
        res.status(200).json({ success: true, message: 'Account verified successfully!' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Email verification failed.', error: error instanceof Error ? error.message : error });
    }
});
exports.verifyEmailAccount = verifyEmailAccount;
const refreshToken = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            res.status(401).json({ error: 'No refresh token provided!' });
            return;
        }
        if ((0, isTokenExpired_1.default)(token)) {
            res.status(401).json({
                message: 'Refresh token expired!'
            });
            return;
        }
        const tokens = await (0, auth_service_1.refreshAuth)(token);
        res.cookie("access_token", tokens.access.token, sendToken_1.accessCookieOptions);
        res.cookie("refresh_token", tokens.refresh.token, sendToken_1.refreshCookieOptions);
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Invalid or expired refresh token', error });
    }
});
exports.refreshToken = refreshToken;
const forgotPasswordLink = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { email } = req.body;
        const user = await (0, users_service_1.getUserByEmail)(email);
        if (!user) {
            res.status(404).json({ success: false, message: 'User email not found!' });
            return;
        }
        const token = await (0, token_service_1.generateResetPasswordToken)(user);
        await (0, email_service_1.default)(email, 'resetPasswordLink', user.firstName, { token: token });
        res.status(200).json({ success: true, message: 'Password reset link sent!', token });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Failed to send reset link.' });
    }
});
exports.forgotPasswordLink = forgotPasswordLink;
const newPassword = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const token = req.params.token;
        console.log(`Token: ${token}`);
        const { password } = req.body;
        console.log(`Reset Password Token: ${token}`);
        console.log(`New Password: ${password}`);
        // Step 1: Decode the token
        const payload = jsonwebtoken_1.default.verify(token, envConfig_1.env.JWT_SECRET);
        if (typeof payload !== 'object' || payload === null || !('email' in payload)) {
            res.status(400).json({ success: false, message: 'Invalid or expired token!' });
        }
        const email = payload.email;
        const user = await (0, users_service_1.getUserByEmail)(email);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found!' });
        }
        await (0, auth_service_1.resetPassword)(token, password);
        if (user) {
            const sent = await (0, email_service_1.default)(user.email || '', 'successfulPasswordChange', user.firstName || '', {});
            console.log(`Email sent: ${sent}`);
        }
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    }
    catch (error) {
        if (error.message === 'Invalid or expired token!') {
            res.status(401).json({ success: false, message: 'Reset link has expired or is invalid.' });
        }
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Reset password failed.' });
    }
});
exports.newPassword = newPassword;
const changePassword = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(400).json({
                error: 'User ID is missing from request.'
            });
            return;
        }
        const user = await (0, users_service_1.getUserById)(userId);
        if (!user.authenticate(oldPassword)) {
            res.status(401).json({ error: 'Incorrect old password!' });
            return;
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password changed successfully!' });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Change password failed.' });
    }
});
exports.changePassword = changePassword;
