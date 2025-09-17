import User from '../models/users/model';
import { IUser, IUserMethods } from '../models/users/model';
import Token from '../models/token/model';

import { TOKEN_TYPES } from '../../utils/constant';
import { generateAuthTokens, verifyToken } from './tokens.service';
import { getUserById, getUserByEmail, updateUserPassword } from './users.service';

// Login with email and password
const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUser> => {
  try {
  if (!email || !password) {
    const error = new Error('Email and password are required!');
    throw error;
  }

  const user = await getUserByEmail(email);
  if (!user) {
    // Distinct error for invalid email
    const error = new Error('Invalid email!');
    (error as any).type = "invalid_email";
    throw error;
  }

  if (typeof user.authenticate !== 'function' || !user.authenticate(password)) {
    // Distinct error for invalid password
    const error = new Error('Invalid password!');
    (error as any).type = "invalid_password";
    throw error;
  }

  return user;
  } catch (error) {
    console.log('Error during login:', error);
    throw error;
  }
};

// Invalidate existing tokens for user
const invalidateExistingTokens = async (userId: string): Promise<boolean> => {
  try {
    const result = await Token.deleteMany({ user: userId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error invalidating tokens:', error);
    throw error;
  }
};

// Logout by revoking refresh token
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: TOKEN_TYPES.REFRESH,
    blacklisted: false,
  });

  if (!refreshTokenDoc) {
    throw new Error('Refresh token not found!');
  }

  if (typeof refreshTokenDoc.deleteOne !== 'function') {
    throw new Error('Invalid refresh token document!');
  }

  await refreshTokenDoc.deleteOne();
};

// Refresh auth tokens
const refreshAuth = async ( refreshToken: string ): Promise<{ access: { token: string; expires: Date }; refresh: { token: string; expires: Date } }> => {
  const refreshTokenDoc = await verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
  const user = await getUserById(refreshTokenDoc.user);

  if (!user) {
    throw new Error('User not found!');
  }
  
  await refreshTokenDoc.deleteOne?.();
  
  return generateAuthTokens(user);
};

// Verify email token and mark user as verified
const verifyEmail = async (verifyEmailToken: string): Promise<IUser> => {
  const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, TOKEN_TYPES.VERIFY_EMAIL);
  const user = await getUserById(verifyEmailTokenDoc.user);

  if (!user) {
    throw new Error('User not found!');
  }

  const updateUserEmail = {
    isVerified: true,
    updatedBy: user.id,
  };

  await User.findOneAndUpdate({ _id: user.id }, updateUserEmail);
  await Token.deleteMany({ user: user.id, type: TOKEN_TYPES.VERIFY_EMAIL });

  return user;
};

// Reset password
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<IUser> => {  
  if (!resetPasswordToken) {
    throw new Error("Reset password token is missing!");
  }

  const { tokenDoc } = await verifyToken(resetPasswordToken, TOKEN_TYPES.RESET_PASSWORD);
  const user = await getUserById(tokenDoc.user);
  console.log("User found for password reset:", user);

  if (!user) {
    throw new Error('User not found!');
  }

  await updateUserPassword(user.id, newPassword);
  await Token.deleteMany({ user: user.id, type: TOKEN_TYPES.RESET_PASSWORD });

  return user;
};

// Change password
const changePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<IUser> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found!');
  }

  if (typeof user.authenticate !== 'function' || !user.authenticate(oldPassword)) {
    throw new Error('Old password is incorrect!');
  }

  await updateUserPassword(user.id, newPassword);

  return user;
}

export {
  loginUserWithEmailAndPassword,
  invalidateExistingTokens,
  logout,
  refreshAuth,
  verifyEmail,
  resetPassword,
  changePassword,
};