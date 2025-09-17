"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetPasswordToken = exports.verifyToken = exports.generateVerifyEmailToken = exports.generateUserActivationCode = exports.generateAuthTokens = exports.saveToken = exports.generateToken = void 0;
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = __importDefault(require("../models/token/model"));
const constant_1 = require("../../utils/constant");
const utils_1 = require("../../utils/utils");
const envConfig_1 = require("../../config/envConfig");
// Generate Token
const generateToken = async (userId, expires, type, secret = envConfig_1.env.JWT_SECRET) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
// Save Token
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    return await model_1.default.create({
        token,
        user: userId,
        expiresAt: expires.toDate(),
        type,
        blacklisted,
    });
};
exports.saveToken = saveToken;
// Generate Auth Tokens
const generateAuthTokens = async (user) => {
    const accessTokenExpires = (0, moment_1.default)().add(Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES), 'minutes');
    const accessToken = await generateToken(user._id, accessTokenExpires, constant_1.TOKEN_TYPES.ACCESS);
    const refreshTokenExpires = (0, moment_1.default)().add(Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS), 'days');
    const refreshToken = await generateToken(user._id, refreshTokenExpires, constant_1.TOKEN_TYPES.REFRESH);
    await saveToken(refreshToken, user._id, refreshTokenExpires, constant_1.TOKEN_TYPES.REFRESH);
    return {
        access: { token: accessToken, expires: accessTokenExpires.toDate() },
        refresh: { token: refreshToken, expires: refreshTokenExpires.toDate() },
    };
};
exports.generateAuthTokens = generateAuthTokens;
// Generate Activation Code Token
const generateUserActivationCode = async (user) => {
    const activationCode = await (0, utils_1.generateActivationCode)();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, envConfig_1.env.JWT_SECRET, { expiresIn: '5m' });
    return { token, activationCode };
};
exports.generateUserActivationCode = generateUserActivationCode;
// Generate Email Verification Token
const generateVerifyEmailToken = async (user) => {
    const activationCode = await (0, utils_1.generateActivationCode)();
    const payload = {
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName
        },
        activationCode
    };
    const token = jsonwebtoken_1.default.sign(payload, envConfig_1.env.JWT_SECRET, { expiresIn: `${envConfig_1.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES}m` });
    const expires = (0, moment_1.default)().add(Number(envConfig_1.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES), 'minutes');
    await saveToken(token, user._id, expires, constant_1.TOKEN_TYPES.VERIFY_EMAIL);
    return { token, activationCode };
};
exports.generateVerifyEmailToken = generateVerifyEmailToken;
// Verify Token
const verifyToken = async (token, type) => {
    if (!token) {
        throw new Error("Token not provided to verifyToken!");
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, envConfig_1.env.JWT_SECRET);
        const tokenDoc = await model_1.default.findOne({
            token,
            type,
            user: payload.sub,
            blacklisted: false,
        });
        if (!tokenDoc)
            throw new Error('Token not found');
        return tokenDoc;
    }
    catch (error) {
        throw new Error('Invalid or expired token!');
    }
};
exports.verifyToken = verifyToken;
// Generate Reset Password Token
const generateResetPasswordToken = async (user) => {
    const expires = (0, moment_1.default)().add(Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES), 'minutes');
    const token = await generateToken(user._id, expires, constant_1.TOKEN_TYPES.RESET_PASSWORD);
    await saveToken(token, user._id, expires, constant_1.TOKEN_TYPES.RESET_PASSWORD);
    return token;
};
exports.generateResetPasswordToken = generateResetPasswordToken;
