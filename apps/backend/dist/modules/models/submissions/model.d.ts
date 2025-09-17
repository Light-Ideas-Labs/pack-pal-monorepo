import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: mongoose.Types.ObjectId | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: mongoose.Types.ObjectId | null | undefined;
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
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: mongoose.Types.ObjectId | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
