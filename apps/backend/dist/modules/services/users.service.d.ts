import { UserDocument, IUser } from "../models/users/model";
declare const createUser: (userData: Partial<IUser>, plainPassword: string) => Promise<UserDocument>;
declare const getAllUsers: () => Promise<(import("mongoose").Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof import("../models/users/model").IUserMethods> & import("../models/users/model").IUserMethods)[]>;
declare const getUserById: (id: string) => Promise<import("mongoose").Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof import("../models/users/model").IUserMethods> & import("../models/users/model").IUserMethods>;
declare const getUserByEmail: (email: string) => Promise<(import("mongoose").Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof import("../models/users/model").IUserMethods> & import("../models/users/model").IUserMethods) | null>;
declare const updateUserById: (id: string, data: any) => Promise<import("mongoose").Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof import("../models/users/model").IUserMethods> & import("../models/users/model").IUserMethods>;
declare const deleteUserById: (UserId: string) => Promise<import("mongoose").Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof import("../models/users/model").IUserMethods> & import("../models/users/model").IUserMethods>;
declare const addProjectToUser: (clerkUserId: string, projectId: string) => Promise<import("mongoose").Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof import("../models/users/model").IUserMethods> & import("../models/users/model").IUserMethods>;
declare const removeProjectFromUser: (clerkUserId: string, projectId: string) => Promise<import("mongoose").Document<unknown, {}, IUser, {}> & Omit<IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof import("../models/users/model").IUserMethods> & import("../models/users/model").IUserMethods>;
export { createUser, getAllUsers, getUserById, getUserByEmail, updateUserById, deleteUserById, addProjectToUser, removeProjectFromUser, };
