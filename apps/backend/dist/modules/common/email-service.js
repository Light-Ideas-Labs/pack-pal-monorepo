"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_config_1 = __importDefault(require("../../config/nodemailer.config")); // king of emails
const email_template_1 = require("./email-template");
const sendMail = async (email, type, firstname, data) => {
    let result;
    let response;
    try {
        // prepare email template
        const message = await prepareEmailTemplate(type, firstname, data);
        // send email
        result = await (0, nodemailer_config_1.default)(email, message);
        response = {
            status: "success",
            message: "Email sent successfully",
            data: result,
        };
    }
    catch (error) {
        console.log("Error sending email:", error);
        response = {
            status: "error",
            message: error || "Failed to send email",
        };
    }
};
// prepare email template messages
const prepareEmailTemplate = async (type, firstname, data) => {
    let message;
    switch (type) {
        case "welcome":
            message = (0, email_template_1.welcomeToCoinListAfrica)(firstname);
            break;
        case "activationCodePhone":
            if (!data.code) {
                throw new Error("Activation code is required for activationCodePhone email type");
            }
            message = (0, email_template_1.sendActivationCodePhone)(firstname, data.code);
            break;
        case "accountActivationLinkAndCode":
            if (!data.token || !data.verificationCode) {
                throw new Error("Token and verification code are required for accountActivationLinkAndCode email type");
            }
            console.log(`Activation Code email: ${data.verificationCode}`);
            message = await (0, email_template_1.sendAccountActivationLinkAndCode)(firstname, data.token, data.verificationCode);
            break;
        case "resetPasswordLink":
            if (!data.token) {
                throw new Error("Reset password token is required");
            }
            message = (0, email_template_1.sendResetPasswordLink)(firstname, data.token);
            break;
        case "successfulPasswordChange":
            message = (0, email_template_1.sendSuccessfulPasswordChange)(firstname);
            break;
        default:
            message = { subject: '', html: '' };
            throw new Error("Invalid email type");
    }
    return message;
};
exports.default = sendMail;
