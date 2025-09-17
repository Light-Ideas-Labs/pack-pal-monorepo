declare const createProject: (data: any) => Promise<import("mongoose").Document<unknown, {}, {
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const getAllProjects: () => Promise<(import("mongoose").Document<unknown, {}, {
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
declare const getProjectById: (id: string) => Promise<import("mongoose").Document<unknown, {}, {
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const updateProjectById: (id: string, data: any) => Promise<(import("mongoose").Document<unknown, {}, {
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
declare const deleteProjectById: (id: string) => Promise<(import("mongoose").Document<unknown, {}, {
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export { createProject, getAllProjects, getProjectById, updateProjectById, deleteProjectById };
