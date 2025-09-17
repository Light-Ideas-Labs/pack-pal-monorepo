import mongoose, { Types } from 'mongoose';
import WatchlistModel, { IWatchlist } from '../models/watchlist/model';

type WatchKind = IWatchlist['target']['kind'];
type Rules = Partial<{
  advisoryChange: boolean;
  docChange: boolean;
  priceDropPct: number;
  daysBeforeStart: number;
}>;

const toId = (v: string | Types.ObjectId) =>
  typeof v === 'string' ? new mongoose.Types.ObjectId(v) : v;

export type ListOpts = {
  page?: number;
  limit?: number;
  kind?: WatchKind;
  label?: string;
  muted?: boolean;
  sort?: Record<string, 1 | -1>;
  populate?: boolean;
};

const addToWatchlist = async ( userId: string | Types.ObjectId, target: { kind: WatchKind; id: string | Types.ObjectId }, opts?: { title?: string; labels?: string[]; isMuted?: boolean; notifyOn?: Rules; meta?: Record<string, any>; }) => {
  const filter = { userId: toId(userId), 'target.kind': target.kind, 'target.id': toId(target.id) };

  // Build $set only with defined fields to avoid wiping existing values
  const $set: Record<string, any> = {};
  if (opts?.title !== undefined) $set.title = opts.title;
  if (opts?.labels !== undefined) $set.labels = opts.labels;
  if (opts?.isMuted !== undefined) $set.isMuted = opts.isMuted;
  if (opts?.notifyOn !== undefined) $set.notifyOn = opts.notifyOn;
  if (opts?.meta !== undefined) $set.meta = opts.meta;

  const doc = await WatchlistModel.findOneAndUpdate(
    filter,
    {
      $setOnInsert: {
        userId: toId(userId),
        target: { kind: target.kind, id: toId(target.id) },
      },
      ...(Object.keys($set).length ? { $set } : {}),
    },
    { upsert: true, new: true }
  ).lean();

  return doc;
}

const removeFromWatchlistByTarget = async(userId: string | Types.ObjectId, target: { kind: WatchKind; id: string | Types.ObjectId }) => {
  return WatchlistModel.findOneAndDelete({userId: toId(userId), 'target.kind': target.kind, 'target.id': toId(target.id)}).lean();
}

const removeFromWatchlistById = async (userId: string | Types.ObjectId, watchlistId: string | Types.ObjectId) => {
  return WatchlistModel.findOneAndDelete({_id: toId(watchlistId), userId: toId(userId)}).lean();
}

const getUserWatchlist = async (userId: string | Types.ObjectId, opts: ListOpts = {}) => {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const q: any = { userId: toId(userId) };
  if (opts.kind) q['target.kind'] = opts.kind;
  if (opts.muted !== undefined) q.isMuted = !!opts.muted;
  if (opts.label) q.labels = opts.label;

  let query = WatchlistModel.find(q)
    .sort(opts.sort ?? { updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (opts.populate) {
    // dynamic populate by refPath:
    query = query.populate({ path: 'target.id', });
  }

  const [items, total] = await Promise.all([query.lean(), WatchlistModel.countDocuments(q)]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / limit)) };
}

const getWatchlistItem = async (userId: string | Types.ObjectId, watchlistId: string | Types.ObjectId, populate = false) => {
  let q = WatchlistModel.findOne({ _id: toId(watchlistId), userId: toId(userId) });
  if (populate) q = q.populate({ path: 'target.id',  });
  return q.lean();
}

const updateWatchlistItem = async (userId: string | Types.ObjectId, watchlistId: string | Types.ObjectId, patch: Partial<Pick<IWatchlist, 'title' | 'labels' | 'isMuted' | 'notifyOn' | 'meta'>>) => {
  const $set: Record<string, any> = {};
  if (patch.title !== undefined) $set.title = patch.title;
  if (patch.labels !== undefined) $set.labels = patch.labels;
  if (patch.isMuted !== undefined) $set.isMuted = patch.isMuted;
  if (patch.notifyOn !== undefined) $set.notifyOn = patch.notifyOn;
  if (patch.meta !== undefined) $set.meta = patch.meta;

  return WatchlistModel.findOneAndUpdate(
    { _id: toId(watchlistId), userId: toId(userId) },
    Object.keys($set).length ? { $set } : {},
    { new: true }
  ).lean();
}

const muteWatchlistItem = async (userId: string | Types.ObjectId, watchlistId: string | Types.ObjectId, isMuted: boolean) => {
  return WatchlistModel.findOneAndUpdate(
    { _id: toId(watchlistId), userId: toId(userId) },
    { $set: { isMuted } },
    { new: true }
  ).lean();
}

const updateNotifyRules = async (userId: string | Types.ObjectId, watchlistId: string | Types.ObjectId, rules: Rules) => {
  return WatchlistModel.findOneAndUpdate(
    { _id: toId(watchlistId), userId: toId(userId) },
    { $set: { notifyOn: rules } },
    { new: true }
  ).lean();
}

const addLabels = async (userId: string | Types.ObjectId, watchlistId: string | Types.ObjectId, labels: string[]) => {
  return WatchlistModel.findOneAndUpdate(
    { _id: toId(watchlistId), userId: toId(userId) },
    { $addToSet: { labels: { $each: labels } } },
    { new: true }
  ).lean();
}

const removeLabel = async (userId: string | Types.ObjectId, watchlistId: string | Types.ObjectId, label: string) => {
  return WatchlistModel.findOneAndUpdate(
    { _id: toId(watchlistId), userId: toId(userId) },
    { $pull: { labels: label } },
    { new: true }
  ).lean();
}

/* Helpers for jobs / notifications */  // match title/meta if you store ISO codes there
const findCountryWatchers = async (countryCode: string) => {
  return WatchlistModel.find({
    'target.kind': 'Countries',
    isMuted: false,
    'notifyOn.advisoryChange': true,
    $or: [
      { title: countryCode },
      { 'meta.code': countryCode },
      { 'meta.to': countryCode },
      { 'meta.country': countryCode },
    ],
  }).select('_id userId target title labels notifyOn').lean();
}

const findTripReminderWatchers = async () => {
  return WatchlistModel.find({
    'target.kind': 'Trips',
    isMuted: false,
    'notifyOn.daysBeforeStart': { $gte: 0 },
  }).select('_id userId target notifyOn').lean();
}

export {
  addToWatchlist,
  removeFromWatchlistByTarget,
  removeFromWatchlistById,
  getUserWatchlist,
  getWatchlistItem,
  updateWatchlistItem,
  muteWatchlistItem,
  updateNotifyRules,
  addLabels,
  removeLabel,
  findCountryWatchers,
  findTripReminderWatchers,
};  