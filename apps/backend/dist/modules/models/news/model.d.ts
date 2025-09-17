import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    link?: string | null | undefined;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    link?: string | null | undefined;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
}, {}> & {
    link?: string | null | undefined;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    link?: string | null | undefined;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    link?: string | null | undefined;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    link?: string | null | undefined;
    projectId?: mongoose.Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
