import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: mongoose.Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: mongoose.Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: mongoose.Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: mongoose.Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: mongoose.Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    useOfFunds: mongoose.Types.DocumentArray<{
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }> & {
        category?: string | null | undefined;
        percentage?: number | null | undefined;
    }>;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    vestingSchedule?: string | null | undefined;
    tokenReleaseChartUrl?: string | null | undefined;
    tokenDistributionChartUrl?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
