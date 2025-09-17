import nodeMailerSendEMail from "../../config/nodemailer.config"; // king of emails
import { welcomeToCoinListAfrica, sendActivationCodePhone, sendAccountActivationLinkAndCode, 
    sendResetPasswordLink, sendSuccessfulPasswordChange } from "./email-template";

interface SendMailData {
    code?: string;
    token?: string;
    verificationCode?: string;
    [key: string]: any;
}

interface SendMailResponse {
    status: "success" | "error";
    message: string;
    data?: any;
}

interface PrepareEmailTemplateData {
    code?: string;
    token?: string;
    verificationCode?: string;
    [key: string]: any;
}

interface EmailMessage {
    subject: string;
    html: string;
    text?: string;
    [key: string]: any;
}

const sendMail = async (email: string, type: string, firstname: string, data: SendMailData): Promise<void> => {
    let result: any;
    let response: SendMailResponse;

    try {
        // prepare email template
        const message: any = await prepareEmailTemplate(type, firstname, data);

        // send email
        result = await nodeMailerSendEMail(email, message);
        response = {
            status: "success",
            message: "Email sent successfully",
            data: result,
        };
    } catch (error: any) {
        console.log("Error sending email:", error);
        response = {
            status: "error",
            message: error || "Failed to send email",
        };
    }
}

// prepare email template messages
const prepareEmailTemplate = async (type: string, firstname: string, data: PrepareEmailTemplateData): Promise<EmailMessage> => {
    let message: EmailMessage;
    switch (type) {
        case "welcome":
            message = welcomeToCoinListAfrica(firstname);
            break;
        case "activationCodePhone":
            if (!data.code) {
                throw new Error("Activation code is required for activationCodePhone email type");
            }
            message = sendActivationCodePhone(firstname, data.code);
            break;
        case "accountActivationLinkAndCode":
            if (!data.token || !data.verificationCode) {
                throw new Error("Token and verification code are required for accountActivationLinkAndCode email type");
            }
            console.log(`Activation Code email: ${data.verificationCode}`);
            message = await sendAccountActivationLinkAndCode(firstname, data.token, data.verificationCode);
            break;
        case "resetPasswordLink":
            if (!data.token) {
                throw new Error("Reset password token is required");
            }
            message = sendResetPasswordLink(firstname, data.token);
            break;
        case "successfulPasswordChange":
            message = sendSuccessfulPasswordChange(firstname);
            break;
        default:
            message = { subject: '', html: '' };
            throw new Error("Invalid email type");
    }

    return message;
}

export default sendMail;