import { IWatchlist } from '../models/watchlist/model';
declare const addToWatchlist: (userId: string, projectId: string) => Promise<import("mongoose").Document<unknown, {}, IWatchlist, {}> & IWatchlist & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const removeFromWatchlist: (userId: string, projectId: string) => Promise<(import("mongoose").Document<unknown, {}, IWatchlist, {}> & IWatchlist & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
declare const getUserWatchlist: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, IWatchlist, {}> & IWatchlist & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export { addToWatchlist, removeFromWatchlist, getUserWatchlist };
