import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    role: string;
    fullname?: string;
    email: string;
    isVerified: boolean;
    salt?: string;
    password?: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    imgUrl?: string;
    gender?: string;
    geolocation?: string;
    website?: string;
    picture?: string;
    facebook?: string;
    twitter?: string;
    google?: string;
    github?: string;
    instagram?: string;
    linkedin?: string;
    steam?: string;
    tokens?: any[];
    projects?: {
        projectId: string;
    }[];
    bookmarks?: mongoose.Schema.Types.ObjectId;
    billingAddress?: () => string;
    subscription?: {
        status: string;
        plan: string;
    };
}
export interface IUserMethods {
    authenticate(plainText: string): boolean;
    encryptPassword(password: string): string;
    billingAddress(): string;
}
export type UserDocument = IUser & IUserMethods;
declare const userModel: mongoose.Model<IUser, {}, IUserMethods, {}, mongoose.Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof IUserMethods> & IUserMethods, mongoose.Schema<IUser, mongoose.Model<IUser, {}, IUserMethods, {}, mongoose.Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof IUserMethods> & IUserMethods, any>, IUserMethods, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUser>, {}> & Omit<mongoose.FlatRecord<IUser> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof IUserMethods> & IUserMethods>>;
export default userModel;
