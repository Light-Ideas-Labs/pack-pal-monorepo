import { Response, CookieOptions } from 'express';
import { UserDocument } from '../modules/models/users/model';
import { generateAuthTokens } from "../modules/services/tokens.service";

// Safe parse helper with fallback
const toSeconds = (envVar: string | undefined, fallback: number): number => {
  const parsed = parseInt(envVar || '', 10);
  return isNaN(parsed) ? fallback : parsed * 60;
};

// Expiry times in seconds
const accessTokenExpire: number = toSeconds(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 15);
const refreshTokenExpire: number = toSeconds(process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS, 30 * 24 * 60);

// Cookie options
export const accessCookieOptions: Partial<CookieOptions> = {
  expires: new Date(Date.now() + accessTokenExpire * 1000),
  maxAge: accessTokenExpire * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

export const refreshCookieOptions: Partial<CookieOptions> = {
  expires: new Date(Date.now() + refreshTokenExpire * 1000),
  maxAge: refreshTokenExpire * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

// Send token function
export const sendToken = async (
  res: Response,
  message: string,
  user: UserDocument,
  statusCode: number
): Promise<Response> => {
  try {
    const tokens = await generateAuthTokens(user);
    const accessToken = tokens.access.token;
    const refreshToken = tokens.refresh.token;

    res.cookie('access_token', accessToken, accessCookieOptions);
    res.cookie('refresh_token', refreshToken, refreshCookieOptions);

    return res.status(statusCode).json({
      success: true,
      message,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate tokens',
      error: error?.message || 'Unknown error',
    });
  }
};