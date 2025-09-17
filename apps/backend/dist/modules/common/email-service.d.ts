interface SendMailData {
    code?: string;
    token?: string;
    verificationCode?: string;
    [key: string]: any;
}
declare const sendMail: (email: string, type: string, firstname: string, data: SendMailData) => Promise<void>;
export default sendMail;
