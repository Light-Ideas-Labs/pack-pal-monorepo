
import mongoose, { Types, isValidObjectId, ClientSession } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../middlewares/errorHandler";
import TripModel from '../models/trips/model';
import TripDayModel from '../models/trip-day/model';
import { paginateMongoose } from "../../utils/pagination";


/** midnight UTC for a given date-like */
const atUTC00 = (d: Date | string) => {
  const x = new Date(d);
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()));
};

const eachUTCDateInclusive = (start: Date | string, end: Date | string) => {
  const out: Date[] = [];
  let cur = atUTC00(start).getTime();
  const last = atUTC00(end).getTime();
  while (cur <= last) {
    out.push(new Date(cur));
    cur += 86400000; // +1 day
  }
  return out;
};

const ensureObjectId = (v: string | Types.ObjectId, field = "id"): Types.ObjectId => {
  if (typeof v === "string") {
    if (!isValidObjectId(v)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid ${field}`);
    }
    return new Types.ObjectId(v);
  }
  return v;
};

const withSession = async <T>(fn: (s: ClientSession) => Promise<T>): Promise<T> => {
  const session = await mongoose.startSession();
  try {
    let out!: T;
    await session.withTransaction(async () => {
      out = await fn(session);
    });
    return out;
  } finally {
    session.endSession();
  }
};

export type PaginationOpts = {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
};

/* ── Trips ───────────────────── */
const createTrip = (opts: { ownerId: string | Types.ObjectId; title: string; coverColor: string; destination: string; startDate: Date | string; endDate: Date | string; }) => {
    try {
    return withSession(async (s) => {
      const trip = await TripModel.create(
        [
          {
            ownerId: ensureObjectId(opts.ownerId, 'ownerId'),
            title: opts.title,
            destination: opts.destination ?? '',
            coverColor: opts.coverColor ?? '#6b7280',
            startDate: new Date(opts.startDate),
            endDate: new Date(opts.endDate),
          },
        ],
        { session: s }
      );


      // auto-create trip days for the date range
      await ensureTripDays(trip[0]._id, opts.startDate, opts.endDate, s);

      return trip[0].toObject();
    });
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create trip");
    }
  }

const getTrip = async (id: string | Types.ObjectId) => {
    try {
    const trip = await TripModel.findById(id).lean();
    if (!trip) throw new ApiError(StatusCodes.NOT_FOUND, 'Trip not found');
    return trip;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get trip");
    }   
  }

const listTripsByOwner = async (ownerId: string | Types.ObjectId, pg: PaginationOpts) =>  {
  console.log("Listing trips for owner:", ownerId, "with pagination:", pg);
    try {
      
        const page = Math.max(1, pg.page ?? 1);
        const limit = Math.min(100, Math.max(1, pg.limit ?? 20));
        const sort = pg.sort ?? { updatedAt: -1 };

        const tripList = await paginateMongoose( TripModel, { ownerId: ensureObjectId(ownerId, 'ownerId') }, { page, limit, sort });

        return tripList;
      } catch (error: any) {
        console.log("Error listing trips:", error);
      }
}


const updateTrip = async (id: string | Types.ObjectId, patch: Partial<{title: string; coverColor: string; startDate: Date | string; endDate: Date | string;}> ) => {
    try {
        const updates: any = { ...patch };
        if (updates.startDate) updates.startDate = new Date(updates.startDate);
        if (updates.endDate) updates.endDate = new Date(updates.endDate);
        
        const trip = await TripModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (!trip) throw new ApiError(StatusCodes.NOT_FOUND, 'Trip not found');
          // if dates changed, ensure trip days
        if (updates.startDate || updates.endDate) {
          await ensureTripDays(
            ensureObjectId(id, 'tripId'),
            updates.startDate ?? trip.startDate,
            updates.endDate ?? trip.endDate
          );
        }

        return trip;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update trip");
    }
}

/* ── Trip Documents ───────────────── */
const addDocument = async (tripId: string | Types.ObjectId, doc: { name: string; url: string; size?: number; mimeType?: string }) => {
    try {
        const trip = await TripModel.findByIdAndUpdate(
            tripId,
      { $push: { documents: doc } },
      { new: true }
    ).lean();
    if (!trip) throw new ApiError(StatusCodes.NOT_FOUND, 'Trip not found');
    return trip;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add document to trip");
    }
  }

const removeDocument = async (tripId: string | Types.ObjectId, documentId: string | Types.ObjectId) => {
    try {
        const trip = await TripModel.findByIdAndUpdate(tripId,
            { $pull: { documents: { _id: ensureObjectId(documentId, 'documentId') } } },
            { new: true }
        ).lean();
        if (!trip) throw new ApiError(StatusCodes.NOT_FOUND, 'Trip not found');
        return trip;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to remove document from trip");
    }
}


/* ── Packing Items ───────────── */
const addPackingItem = async (tripId: string | Types.ObjectId, item: { name: string; quantity?: number; category?: string }) => {
    try {
        const trip = await TripModel.findByIdAndUpdate(
            tripId,
            { $push: { packingItems: { name: item.name, quantity: item.quantity ?? 1, category: item.category ?? 'general' } } },
            { new: true }
        ).lean();
        if (!trip) throw new ApiError(StatusCodes.NOT_FOUND, 'Trip not found');
        return trip;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add packing item to trip");
    }
}

const togglePackingChecked = async (tripId: string | Types.ObjectId, itemId: string | Types.ObjectId, checked: boolean) =>  {
    try {
    const trip = await TripModel.findOneAndUpdate(
      { _id: ensureObjectId(tripId, 'tripId'), 'packingItems._id': ensureObjectId(itemId, 'itemId') },
      { $set: { 'packingItems.$.checked': checked } },
      { new: true }
    ).lean();
    if (!trip) throw new ApiError(StatusCodes.NOT_FOUND, 'Trip/item not found');
    return trip;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to toggle packing item");
    }
  }   

/* ── Collaborators ───────────── */
const setCollaborator = async (tripId: string | Types.ObjectId, userId: string | Types.ObjectId, role: 'OWNER' | 'EDITOR' | 'VIEWER' | 'CONTRIBUTOR', status: 'pending' | 'accepted' | 'rejected' = 'pending') => {
    const trip = await TripModel.findByIdAndUpdate(
      tripId,
      {
        $pull: { collaborations: { userId: ensureObjectId(userId, 'userId') } },
      },
      { new: true }
    );
    if (!trip) throw new ApiError(StatusCodes.NOT_FOUND, 'Trip not found');

    trip.collaborations.push({ userId: ensureObjectId(userId, 'userId'), role, status } as any);
    await trip.save();
    return trip.toObject();
  }

/* ── Days ────────────────────── */
const addDay = async (tripId: string | Types.ObjectId, payload: {
    date: Date | string;
    label?: string;
    description?: string;
    category?: 'travel' | 'activity' | 'meal' | 'stay' | 'other';
    website?: string;
    tokenSymbol?: string;
    cost?: number;
    location?: {
      type?: 'hotel' | 'restaurant' | 'activity';
      name?: string;
      address?: string;
      coordinates?: { lat?: number; lng?: number };
    };
    activities?: Array<{ time?: string; title: string; description?: string; location?: string; }>;
  }) =>  {
    return withSession(async (s) => {
      const count = await TripDayModel.countDocuments({ tripId: ensureObjectId(tripId, 'tripId') }).session(s);
      const day = await TripDayModel.create(
        [
          {
            tripId: ensureObjectId(tripId, 'tripId'),
            date: new Date(payload.date),
            order: count + 1,
            label: payload.label ?? '',
            description: payload.description ?? '',
            category: payload.category ?? 'other',
            website: payload.website,
            tokenSymbol: payload.tokenSymbol,
            cost: payload.cost,
            location: payload.location,
            activities: payload.activities ?? [],
          },
        ],
        { session: s }
      );
      return day[0].toObject();
    });
  }

/** Reorder days: pass array of {_id, order}. Performs uniqueness within trip. */
const reorderDays =  async(tripId: string | Types.ObjectId, orders: Array<{ _id: string | Types.ObjectId; order: number }>) => {
    return withSession(async (s) => {
      const updates = orders.map((o) =>
        TripDayModel.updateOne(
          { _id: ensureObjectId(o._id, 'dayId'), tripId: ensureObjectId(tripId, 'tripId') },
          { $set: { order: o.order } }
        ).session(s)
      );
      await Promise.all(updates);
      const days = await TripDayModel.find({ tripId: ensureObjectId(tripId, 'tripId') }).sort({ order: 1 }).lean();
      return days;
    });
  }

const removeDay = async (tripId: string | Types.ObjectId, dayId: string | Types.ObjectId) => {
    return withSession(async (s) => {
      const day = await TripDayModel.findOneAndDelete({ _id: ensureObjectId(dayId, 'dayId'), tripId: ensureObjectId(tripId, 'tripId') }).session(s);
      if (!day) throw new ApiError(StatusCodes.NOT_FOUND, 'Trip day not found');

      // compact orders
      const days = await TripDayModel.find({ tripId: ensureObjectId(tripId, 'tripId') }).sort({ order: 1 }).session(s);
      await Promise.all(
        days.map((d: any, idx: number) =>
          d.order !== idx + 1 ? TripDayModel.updateOne({ _id: d._id }, { $set: { order: idx + 1 } }).session(s) : null
        )
      );
      return { ok: true };
    });
  }

/* admin maintenance tasks */ /** Compact TripDay orders for a trip (1..n) */
const compactTripDayOrders = async (tripId: string | Types.ObjectId) => {
    const days = await TripDayModel.find({ tripId: ensureObjectId(tripId, 'tripId') }).sort({ order: 1 });
    for (let i = 0; i < days.length; i++) {
      if (days[i].order !== i + 1) {
        // eslint-disable-next-line no-await-in-loop
        await TripDayModel.updateOne({ _id: days[i]._id }, { $set: { order: i + 1 } });
      }
    }
    return { ok: true, count: days.length };
  }


  /**
 * Create missing TripDay docs and remove extras so that the set of TripDays
 * exactly matches [startDate..endDate]. Keeps activities on kept days.
 */
export const ensureTripDays = async (tripId: Types.ObjectId, startDate: Date | string, endDate: Date | string, session?: mongoose.ClientSession ) => {
  const wanted = eachUTCDateInclusive(startDate, endDate);
  const wantedKeys = new Set(wanted.map(d => d.toISOString()));

  const existing = await TripDayModel.find({ tripId }).sort({ order: 1 }).session(session ?? null);
  const existingByKey = new Map(existing.map(d => [atUTC00(d.date).toISOString(), d]));

  // create missing (use wanted order)
  const toCreate: any[] = [];
  wanted.forEach((d, idx) => {
    const key = d.toISOString();
    if (!existingByKey.has(key)) {
      toCreate.push({ tripId, date: d, order: idx + 1, label: "" });
    }
  });

  if (toCreate.length) {
    await TripDayModel.insertMany(toCreate, { session });
  }

  // remove extras (days outside the new range)
  const extras = existing.filter(d => !wantedKeys.has(atUTC00(d.date).toISOString()));
  if (extras.length) {
    await TripDayModel.deleteMany(
      { _id: { $in: extras.map(d => d._id) } },
      { session }
    );
  }

  // normalize order 1..n in wanted sequence
  const updates = await TripDayModel.find({ tripId }).session(session ?? null);
  updates.sort((a, b) => atUTC00(a.date).getTime() - atUTC00(b.date).getTime());
  await Promise.all(
    updates.map((d, i) =>
      d.order !== i + 1
        ? TripDayModel.updateOne({ _id: d._id }, { $set: { order: i + 1 } }).session(session ?? null)
        : Promise.resolve()
    )
  );

  return TripDayModel.find({ tripId }).sort({ order: 1 }).lean();
};

const listDaysForTrip = async (tripId: string | Types.ObjectId) => {
  try {
    const days = await TripDayModel.find({ tripId: ensureObjectId(tripId, "tripId") }).sort({ order: 1 }).lean();
    return days;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching trip days');
  }
};


export {
  createTrip,
  getTrip,
  listTripsByOwner,
  updateTrip,
  addDocument,
  removeDocument,
  addPackingItem,
  togglePackingChecked,
  setCollaborator,
  addDay,
  reorderDays,
  removeDay,
  compactTripDayOrders,
  listDaysForTrip
}