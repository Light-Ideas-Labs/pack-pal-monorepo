import { Moment } from 'moment';
import { UserDocument } from '../models/users/model';
declare const generateToken: (userId: string, expires: Moment, type: string, secret?: string) => Promise<string>;
declare const saveToken: (token: string, userId: string, expires: Moment, type: string, blacklisted?: boolean) => Promise<any>;
declare const generateAuthTokens: (user: UserDocument) => Promise<{
    access: {
        token: string;
        expires: Date;
    };
    refresh: {
        token: string;
        expires: Date;
    };
}>;
declare const generateUserActivationCode: (user: UserDocument) => Promise<{
    token: string;
    activationCode: string;
}>;
declare const generateVerifyEmailToken: (user: UserDocument) => Promise<{
    token: string;
    activationCode: string;
}>;
declare const verifyToken: (token: string, type: string) => Promise<any>;
declare const generateResetPasswordToken: (user: UserDocument) => Promise<string>;
export { generateToken, saveToken, generateAuthTokens, generateUserActivationCode, generateVerifyEmailToken, verifyToken, generateResetPasswordToken, };
