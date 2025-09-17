import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    projectId?: mongoose.Types.ObjectId | null | undefined;
    tokenSymbol?: string | null | undefined;
    tokenName?: string | null | undefined;
    priceUSD?: number | null | undefined;
    priceChange24h?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    circulatingSupply?: number | null | undefined;
    totalSupply?: number | null | undefined;
    holdersCount?: number | null | undefined;
    lastUpdated?: NativeDate | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    projectId?: mongoose.Types.ObjectId | null | undefined;
    tokenSymbol?: string | null | undefined;
    tokenName?: string | null | undefined;
    priceUSD?: number | null | undefined;
    priceChange24h?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    circulatingSupply?: number | null | undefined;
    totalSupply?: number | null | undefined;
    holdersCount?: number | null | undefined;
    lastUpdated?: NativeDate | null | undefined;
}, {}> & {
    projectId?: mongoose.Types.ObjectId | null | undefined;
    tokenSymbol?: string | null | undefined;
    tokenName?: string | null | undefined;
    priceUSD?: number | null | undefined;
    priceChange24h?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    circulatingSupply?: number | null | undefined;
    totalSupply?: number | null | undefined;
    holdersCount?: number | null | undefined;
    lastUpdated?: NativeDate | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    projectId?: mongoose.Types.ObjectId | null | undefined;
    tokenSymbol?: string | null | undefined;
    tokenName?: string | null | undefined;
    priceUSD?: number | null | undefined;
    priceChange24h?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    circulatingSupply?: number | null | undefined;
    totalSupply?: number | null | undefined;
    holdersCount?: number | null | undefined;
    lastUpdated?: NativeDate | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    projectId?: mongoose.Types.ObjectId | null | undefined;
    tokenSymbol?: string | null | undefined;
    tokenName?: string | null | undefined;
    priceUSD?: number | null | undefined;
    priceChange24h?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    circulatingSupply?: number | null | undefined;
    totalSupply?: number | null | undefined;
    holdersCount?: number | null | undefined;
    lastUpdated?: NativeDate | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    projectId?: mongoose.Types.ObjectId | null | undefined;
    tokenSymbol?: string | null | undefined;
    tokenName?: string | null | undefined;
    priceUSD?: number | null | undefined;
    priceChange24h?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    circulatingSupply?: number | null | undefined;
    totalSupply?: number | null | undefined;
    holdersCount?: number | null | undefined;
    lastUpdated?: NativeDate | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
