declare const submitProject: (data: any) => Promise<import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: import("mongoose").Types.ObjectId | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const getAllSubmissions: (filterStatus?: string) => Promise<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: import("mongoose").Types.ObjectId | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
declare const getPendingSubmissions: () => Promise<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: import("mongoose").Types.ObjectId | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
declare const updateSubmissionStatus: (submissionId: string, status: "approved" | "rejected", notes?: string) => Promise<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: import("mongoose").Types.ObjectId | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "approved" | "rejected";
    name: string;
    website?: string | null | undefined;
    description?: string | null | undefined;
    category?: string | null | undefined;
    tokenSymbol?: string | null | undefined;
    slug?: string | null | undefined;
    adminNotes?: string | null | undefined;
    submittedBy?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export { submitProject, getAllSubmissions, getPendingSubmissions, updateSubmissionStatus };
