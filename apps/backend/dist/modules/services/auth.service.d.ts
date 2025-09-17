import { IUser } from '../models/users/model';
declare const loginUserWithEmailAndPassword: (email: string, password: string) => Promise<IUser>;
declare const invalidateExistingTokens: (userId: string) => Promise<boolean>;
declare const logout: (refreshToken: string) => Promise<void>;
declare const refreshAuth: (refreshToken: string) => Promise<{
    access: {
        token: string;
        expires: Date;
    };
    refresh: {
        token: string;
        expires: Date;
    };
}>;
declare const verifyEmail: (verifyEmailToken: string) => Promise<IUser>;
declare const resetPassword: (resetPasswordToken: string, newPassword: string) => Promise<IUser>;
declare const changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<IUser>;
export { loginUserWithEmailAndPassword, invalidateExistingTokens, logout, refreshAuth, verifyEmail, resetPassword, changePassword, };
