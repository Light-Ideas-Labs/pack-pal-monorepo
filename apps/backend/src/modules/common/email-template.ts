import { env } from '../../config/envConfig'

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

// sendActivationCode
interface ActivationCodeMessage {
    subject: string;
    text: string;
    html: string;
}

interface SendAccountActivationLinkAndCodeParams {
        firstname: string;
        token: string;
        verificationCode: string;
    }

const welcomeToCoinListAfrica = (firstname: string): EmailMessage => {
    const hostURL = `${process.env.APP_FRONTEND_URL}/auth/signin`;

    const message: EmailMessage = {
        subject: "Welcome to Coinlist Africa",
        text: `Hi ${firstname}, welcome to Coinlist Africa! We are excited to have you on board. Please visit ${hostURL} to log in and start exploring our platform.`,
        html: `<p>Hi ${firstname}, welcome to Coinlist Africa</p>`,
    };

    return message;
};

const sendActivationCodePhone = (firstname: string, code: string): ActivationCodeMessage => {
  const message: ActivationCodeMessage = {
    subject: "Account Activation Code",
    text: `Hi ${firstname}, your account activation code is ${code}`,
    html: `<p>Hi ${firstname}, your account activation code is ${code}</p>`,
  };
  return message;
};


/**
 * Send email verification after registration
 * @param {string} token
 * @param {string} firstname
 * @param {string} verificationCode
 * @returns {Promise<void>}
 */
const sendAccountActivationLinkAndCode = async (firstname: string, token: string, verificationCode: string): Promise<ActivationCodeMessage> => {
    console.log(`Activation Code temp: ${verificationCode}`);
    const hostURL = `${env.APP_FRONTEND_URL}/auth/activate-account?token=${token}&code=${verificationCode}`;
    const message: ActivationCodeMessage = {
        subject: "Account Activation",
        text: `Hi ${firstname}, please click the link below to activate your account: ${hostURL}`,
        html: `<p>Hi ${firstname}, please click the link below to activate your account:</p><a href="${hostURL}">Activate Account</a>`,
      };
    
    return message;
};


const sendResetPasswordLink = (firstname: string, token: string): EmailMessage => {
  const resetURL = `${env.APP_FRONTEND_URL}/auth/reset-password?token=${token}`;
  return {
    subject: "Reset Your Password",
    text: `Hi ${firstname}, click this link to reset your password: ${resetURL}`,
    html: `<p>Hi ${firstname},</p><p>Click the link below to reset your password:</p><a href="${resetURL}">Reset Password</a>`,
  };
};

const sendSuccessfulPasswordChange = (firstname: string): EmailMessage => {
  return {
    subject: "Password Changed Successfully",
    text: `Hi ${firstname}, your password has been changed successfully.`,
    html: `<p>Hi ${firstname},</p><p>Your password has been changed successfully.</p>`,
  };
}
  


export {
    welcomeToCoinListAfrica,
    sendActivationCodePhone,
    sendAccountActivationLinkAndCode,
    sendResetPasswordLink,
    sendSuccessfulPasswordChange
}