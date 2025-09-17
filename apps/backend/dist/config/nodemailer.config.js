"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const envConfig_1 = require("./envConfig");
const nodeMailerSendMail = async (recipient, message) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: envConfig_1.env.SMTP_EMAIL_HOST || 'smtp.gmail.com',
            port: envConfig_1.env.SMTP_EMAIL_PORT || 587,
            service: envConfig_1.env.SMTP_EMAIL_SERVICE, // e.g., 'gmail', 'yahoo', etc.
            secure: false, // true for 465, false for other ports
            auth: {
                user: envConfig_1.env.SMTP_EMAIL_USER,
                pass: envConfig_1.env.SMTP_EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: envConfig_1.env.EMAIL_SENDER_FROM,
            to: recipient,
            subject: message.subject,
            text: typeof message.text === "string" ? message.text : '', // ensure it's a string
            html: typeof message.html === "string" ? message.html : '', // ensure it's a string
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log("Error in nodeMailerSendMail:", error);
        throw new Error("Failed to send email");
    }
};
exports.default = nodeMailerSendMail;
