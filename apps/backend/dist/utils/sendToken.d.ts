import { Response, CookieOptions } from 'express';
import { UserDocument } from '../modules/models/users/model';
export declare const accessCookieOptions: Partial<CookieOptions>;
export declare const refreshCookieOptions: Partial<CookieOptions>;
export declare const sendToken: (res: Response, message: string, user: UserDocument, statusCode: number) => Promise<Response>;
