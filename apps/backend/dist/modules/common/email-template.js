"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessfulPasswordChange = exports.sendResetPasswordLink = exports.sendAccountActivationLinkAndCode = exports.sendActivationCodePhone = exports.welcomeToCoinListAfrica = void 0;
const envConfig_1 = require("../../config/envConfig");
const welcomeToCoinListAfrica = (firstname) => {
    const hostURL = `${process.env.APP_FRONTEND_URL}/auth/signin`;
    const message = {
        subject: "Welcome to Coinlist Africa",
        text: `Hi ${firstname}, welcome to Coinlist Africa! We are excited to have you on board. Please visit ${hostURL} to log in and start exploring our platform.`,
        html: `<p>Hi ${firstname}, welcome to Coinlist Africa</p>`,
    };
    return message;
};
exports.welcomeToCoinListAfrica = welcomeToCoinListAfrica;
const sendActivationCodePhone = (firstname, code) => {
    const message = {
        subject: "Account Activation Code",
        text: `Hi ${firstname}, your account activation code is ${code}`,
        html: `<p>Hi ${firstname}, your account activation code is ${code}</p>`,
    };
    return message;
};
exports.sendActivationCodePhone = sendActivationCodePhone;
/**
 * Send email verification after registration
 * @param {string} token
 * @param {string} firstname
 * @param {string} verificationCode
 * @returns {Promise<void>}
 */
const sendAccountActivationLinkAndCode = async (firstname, token, verificationCode) => {
    console.log(`Activation Code temp: ${verificationCode}`);
    const hostURL = `${envConfig_1.env.APP_FRONTEND_URL}/auth/activate-account?token=${token}&code=${verificationCode}`;
    const message = {
        subject: "Account Activation",
        text: `Hi ${firstname}, please click the link below to activate your account: ${hostURL}`,
        html: `<p>Hi ${firstname}, please click the link below to activate your account:</p><a href="${hostURL}">Activate Account</a>`,
    };
    return message;
};
exports.sendAccountActivationLinkAndCode = sendAccountActivationLinkAndCode;
const sendResetPasswordLink = (firstname, token) => {
    const resetURL = `${envConfig_1.env.APP_FRONTEND_URL}/auth/reset-password?token=${token}`;
    return {
        subject: "Reset Your Password",
        text: `Hi ${firstname}, click this link to reset your password: ${resetURL}`,
        html: `<p>Hi ${firstname},</p><p>Click the link below to reset your password:</p><a href="${resetURL}">Reset Password</a>`,
    };
};
exports.sendResetPasswordLink = sendResetPasswordLink;
const sendSuccessfulPasswordChange = (firstname) => {
    return {
        subject: "Password Changed Successfully",
        text: `Hi ${firstname}, your password has been changed successfully.`,
        html: `<p>Hi ${firstname},</p><p>Your password has been changed successfully.</p>`,
    };
};
exports.sendSuccessfulPasswordChange = sendSuccessfulPasswordChange;
