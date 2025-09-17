declare const createOrUpdateTokenomics: (projectId: string, data: any) => Promise<import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: import("mongoose").Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, import("mongoose").Types.Subdocument<import("mongoose").Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: import("mongoose").Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, import("mongoose").Types.Subdocument<import("mongoose").Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const getTokenomicsByProjectId: (projectId: string) => Promise<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: import("mongoose").Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, import("mongoose").Types.Subdocument<import("mongoose").Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: import("mongoose").Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, import("mongoose").Types.Subdocument<import("mongoose").Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export { createOrUpdateTokenomics, getTokenomicsByProjectId };
