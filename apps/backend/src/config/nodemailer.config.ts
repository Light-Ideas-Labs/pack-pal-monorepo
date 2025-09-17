import nodemailer from 'nodemailer';
import { env } from './envConfig'

const nodeMailerSendMail = async (recipient: string, message: EmailMessage): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            host: env.SMTP_EMAIL_HOST || 'smtp.gmail.com',
            port: env.SMTP_EMAIL_PORT || 587,
            service: env.SMTP_EMAIL_SERVICE, // e.g., 'gmail', 'yahoo', etc.
            secure: false, // true for 465, false for other ports
            auth: {
                user: env.SMTP_EMAIL_USER,
                pass: env.SMTP_EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: env.EMAIL_SENDER_FROM,
            to: recipient,
            subject: message.subject,
            text: typeof message.text === "string" ? message.text : '', // ensure it's a string
            html: typeof message.html === "string" ? message.html : '', // ensure it's a string
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error in nodeMailerSendMail:", error);
        throw new Error("Failed to send email");
    }
}

export default nodeMailerSendMail;