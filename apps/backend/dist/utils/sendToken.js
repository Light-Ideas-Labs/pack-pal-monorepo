"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshCookieOptions = exports.accessCookieOptions = void 0;
const token_service_1 = require("../modules/services/token.service");
// Safe parse helper with fallback
const toSeconds = (envVar, fallback) => {
    const parsed = parseInt(envVar || '', 10);
    return isNaN(parsed) ? fallback : parsed * 60;
};
// Expiry times in seconds
const accessTokenExpire = toSeconds(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 15);
const refreshTokenExpire = toSeconds(process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS, 30 * 24 * 60);
// Cookie options
exports.accessCookieOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
};
exports.refreshCookieOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
};
// Send token function
const sendToken = async (res, message, user, statusCode) => {
    try {
        const tokens = await (0, token_service_1.generateAuthTokens)(user);
        const accessToken = tokens.access.token;
        const refreshToken = tokens.refresh.token;
        res.cookie('access_token', accessToken, exports.accessCookieOptions);
        res.cookie('refresh_token', refreshToken, exports.refreshCookieOptions);
        return res.status(statusCode).json({
            success: true,
            message,
            accessToken,
            refreshToken,
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to generate tokens',
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
        });
    }
};
exports.sendToken = sendToken;
