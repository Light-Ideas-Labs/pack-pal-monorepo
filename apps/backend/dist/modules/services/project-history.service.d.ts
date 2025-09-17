declare const saveProjectSnapshot: (data: {
    projectId: string;
    priceUSD: number;
    marketCapUSD: number;
    volume24hUSD: number;
    holdersCount: number;
}) => Promise<import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: import("mongoose").Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: import("mongoose").Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const getProjectHistory: (projectId: string, days?: number) => Promise<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: import("mongoose").Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    projectId: import("mongoose").Types.ObjectId;
    timestamp: NativeDate;
    priceUSD?: number | null | undefined;
    marketCapUSD?: number | null | undefined;
    volume24hUSD?: number | null | undefined;
    holdersCount?: number | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export { saveProjectSnapshot, getProjectHistory, };
