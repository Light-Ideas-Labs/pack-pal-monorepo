import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
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
    projectId: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
