/**
 *  Send welcome email
 *  @param {string} username
 *
 */
interface EmailMessage {
    subject: string;
    text: string;
    html: string;
}
interface ActivationCodeMessage {
    subject: string;
    text: string;
    html: string;
}
declare const welcomeToCoinListAfrica: (firstname: string) => EmailMessage;
declare const sendActivationCodePhone: (firstname: string, code: string) => ActivationCodeMessage;
/**
 * Send email verification after registration
 * @param {string} token
 * @param {string} firstname
 * @param {string} verificationCode
 * @returns {Promise<void>}
 */
declare const sendAccountActivationLinkAndCode: (firstname: string, token: string, verificationCode: string) => Promise<ActivationCodeMessage>;
declare const sendResetPasswordLink: (firstname: string, token: string) => EmailMessage;
declare const sendSuccessfulPasswordChange: (firstname: string) => EmailMessage;
export { welcomeToCoinListAfrica, sendActivationCodePhone, sendAccountActivationLinkAndCode, sendResetPasswordLink, sendSuccessfulPasswordChange };
