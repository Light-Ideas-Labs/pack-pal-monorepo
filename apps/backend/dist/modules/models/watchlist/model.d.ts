import mongoose, { Document } from 'mongoose';
export interface IWatchlist extends Document {
    userId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
}
declare const WatchlistModel: mongoose.Model<IWatchlist, {}, {}, {}, mongoose.Document<unknown, {}, IWatchlist, {}> & IWatchlist & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default WatchlistModel;
