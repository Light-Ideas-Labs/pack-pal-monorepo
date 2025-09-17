declare const createNews: (data: any) => Promise<import("mongoose").Document<unknown, {}, {
    link?: string | null | undefined;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
}, {}> & {
    link?: string | null | undefined;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const getAllNews: () => Promise<(import("mongoose").Document<unknown, {}, {
    link?: string | null | undefined;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
}, {}> & {
    link?: string | null | undefined;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
declare const getNewsByProjectId: (projectId: string) => Promise<(import("mongoose").Document<unknown, {}, {
    link?: string | null | undefined;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
}, {}> & {
    link?: string | null | undefined;
    projectId?: import("mongoose").Types.ObjectId | null | undefined;
    source?: string | null | undefined;
    title?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export { createNews, getAllNews, getNewsByProjectId };
