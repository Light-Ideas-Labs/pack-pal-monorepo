import mongoose from "mongoose";
declare const Token: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    user: mongoose.Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
    blacklisted: boolean;
    schemaVersion: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    user: mongoose.Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
    blacklisted: boolean;
    schemaVersion: number;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    user: mongoose.Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
    blacklisted: boolean;
    schemaVersion: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    user: mongoose.Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
    blacklisted: boolean;
    schemaVersion: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    user: mongoose.Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
    blacklisted: boolean;
    schemaVersion: number;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    user: mongoose.Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
    blacklisted: boolean;
    schemaVersion: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Token;
