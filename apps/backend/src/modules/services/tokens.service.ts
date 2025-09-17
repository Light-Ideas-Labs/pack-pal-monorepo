import moment, { Moment } from 'moment';
import jwt from "jsonwebtoken";

import Token from '../models/token/model';
import { UserDocument } from '../models/users/model';
import { TOKEN_TYPES } from '../../utils/constant';
import { generateActivationCode } from '../../utils/utils';
import { env } from '../../config/envConfig';


// Generate Token
const generateToken = async (userId: string, expires: Moment, type: string, secret: string = env.JWT_SECRET): Promise<string> => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

// Save Token
const saveToken = async (token: string, userId: string, expires: Moment, type: string, blacklisted = false): Promise<any> => {
  return await Token.create({
    token,
    user: userId,
    expiresAt: expires.toDate(),
    type,
    blacklisted,
  });
};

// Generate Auth Tokens
const generateAuthTokens = async (user: UserDocument): Promise<{access: { token: string; expires: Date }; refresh: { token: string; expires: Date }; }> => {
  const accessTokenExpires = moment().add(Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES), 'minutes');
  const accessToken = await generateToken(user._id as unknown as string, accessTokenExpires, TOKEN_TYPES.ACCESS);

  const refreshTokenExpires = moment().add(Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS), 'days');
  const refreshToken = await generateToken(user._id as unknown as string, refreshTokenExpires, TOKEN_TYPES.REFRESH);

  await saveToken(refreshToken, user._id as unknown as string, refreshTokenExpires, TOKEN_TYPES.REFRESH);

  return {
    access: { token: accessToken, expires: accessTokenExpires.toDate() },
    refresh: { token: refreshToken, expires: refreshTokenExpires.toDate() },
  };
};

// Generate Activation Code Token
const generateUserActivationCode = async (user: UserDocument): Promise<{ token: string; activationCode: string }> => {
  const activationCode = await generateActivationCode();
  const token = jwt.sign({ user, activationCode }, env.JWT_SECRET, { expiresIn: '5m' });
  return { token, activationCode };
};

// Generate Email Verification Token
const generateVerifyEmailToken = async (user: UserDocument): Promise<{ token: string; activationCode: string }> => {
  const activationCode = await generateActivationCode();
  const payload = {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName
    },
    activationCode
  };

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: `${env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES}m` });

  const expires = moment().add(Number(env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES), 'minutes');
  await saveToken(token, user._id as unknown as string, expires, TOKEN_TYPES.VERIFY_EMAIL);

  return { token, activationCode };
};

// Verify Token
const verifyToken = async (token: string, type: string): Promise<any> => {
    if (!token) {
      throw new Error("Token not provided to verifyToken!");
    }
    
    let payload;
    
    try {
      payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
      const tokenDoc = await Token.findOne({
        token,
        type,
        user: payload.sub,
        blacklisted: false,
      });
      
      if (!tokenDoc) throw new Error('Token not found');
      
      return tokenDoc;
  } catch (error) {
    throw new Error('Invalid or expired token!');
  }
};

// Generate Reset Password Token
const generateResetPasswordToken = async (user: UserDocument): Promise<string> => {
    const expires = moment().add(Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES), 'minutes');
    const token = await generateToken(user._id as unknown as string, expires, TOKEN_TYPES.RESET_PASSWORD);
    await saveToken(token, user._id as unknown as string, expires, TOKEN_TYPES.RESET_PASSWORD);
    return token;
};

export {
  generateToken,
  saveToken,
  generateAuthTokens,
  generateUserActivationCode,
  generateVerifyEmailToken,
  verifyToken,
  generateResetPasswordToken,
};