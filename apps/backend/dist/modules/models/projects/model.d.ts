import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    description: string;
    tags: string[];
    slug: string;
    chainDeployedTo: string[];
    communityLinks: string[];
    exchangeLinks: string[];
    keyBackers: string[];
    website?: string | null | undefined;
    category?: string | null | undefined;
    region?: string | null | undefined;
    country?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    whitepaperLink?: string | null | undefined;
    tokenAddress?: string | null | undefined;
    listedAt?: NativeDate | null | undefined;
    isActive?: boolean | null | undefined;
    logoUrl?: string | null | undefined;
    aiInsights?: {
        newsLinks: string[];
        summary?: string | null | undefined;
        sentimentScore?: number | null | undefined;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    description: string;
    tags: string[];
    slug: string;
    chainDeployedTo: string[];
    communityLinks: string[];
    exchangeLinks: string[];
    keyBackers: string[];
    website?: string | null | undefined;
    category?: string | null | undefined;
    region?: string | null | undefined;
    country?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    whitepaperLink?: string | null | undefined;
    tokenAddress?: string | null | undefined;
    listedAt?: NativeDate | null | undefined;
    isActive?: boolean | null | undefined;
    logoUrl?: string | null | undefined;
    aiInsights?: {
        newsLinks: string[];
        summary?: string | null | undefined;
        sentimentScore?: number | null | undefined;
    } | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    description: string;
    tags: string[];
    slug: string;
    chainDeployedTo: string[];
    communityLinks: string[];
    exchangeLinks: string[];
    keyBackers: string[];
    website?: string | null | undefined;
    category?: string | null | undefined;
    region?: string | null | undefined;
    country?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    whitepaperLink?: string | null | undefined;
    tokenAddress?: string | null | undefined;
    listedAt?: NativeDate | null | undefined;
    isActive?: boolean | null | undefined;
    logoUrl?: string | null | undefined;
    aiInsights?: {
        newsLinks: string[];
        summary?: string | null | undefined;
        sentimentScore?: number | null | undefined;
    } | null | undefined;
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
    name: string;
    description: string;
    tags: string[];
    slug: string;
    chainDeployedTo: string[];
    communityLinks: string[];
    exchangeLinks: string[];
    keyBackers: string[];
    website?: string | null | undefined;
    category?: string | null | undefined;
    region?: string | null | undefined;
    country?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    whitepaperLink?: string | null | undefined;
    tokenAddress?: string | null | undefined;
    listedAt?: NativeDate | null | undefined;
    isActive?: boolean | null | undefined;
    logoUrl?: string | null | undefined;
    aiInsights?: {
        newsLinks: string[];
        summary?: string | null | undefined;
        sentimentScore?: number | null | undefined;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    description: string;
    tags: string[];
    slug: string;
    chainDeployedTo: string[];
    communityLinks: string[];
    exchangeLinks: string[];
    keyBackers: string[];
    website?: string | null | undefined;
    category?: string | null | undefined;
    region?: string | null | undefined;
    country?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    whitepaperLink?: string | null | undefined;
    tokenAddress?: string | null | undefined;
    listedAt?: NativeDate | null | undefined;
    isActive?: boolean | null | undefined;
    logoUrl?: string | null | undefined;
    aiInsights?: {
        newsLinks: string[];
        summary?: string | null | undefined;
        sentimentScore?: number | null | undefined;
    } | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    description: string;
    tags: string[];
    slug: string;
    chainDeployedTo: string[];
    communityLinks: string[];
    exchangeLinks: string[];
    keyBackers: string[];
    website?: string | null | undefined;
    category?: string | null | undefined;
    region?: string | null | undefined;
    country?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    whitepaperLink?: string | null | undefined;
    tokenAddress?: string | null | undefined;
    listedAt?: NativeDate | null | undefined;
    isActive?: boolean | null | undefined;
    logoUrl?: string | null | undefined;
    aiInsights?: {
        newsLinks: string[];
        summary?: string | null | undefined;
        sentimentScore?: number | null | undefined;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
