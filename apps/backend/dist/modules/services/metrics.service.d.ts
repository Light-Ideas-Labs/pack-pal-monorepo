declare const upsertMetricsByProjectId: (projectId: string, data: any) => Promise<import("mongoose").Document<unknown, {}, {
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
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
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const getMetricsByProjectId: (projectId: string) => Promise<(import("mongoose").Document<unknown, {}, {
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
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
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export { upsertMetricsByProjectId, getMetricsByProjectId };
