import mongoose, { Schema, Document } from 'mongoose';

type WatchTargetKind = 'Project' | 'Trips' | 'Places' | 'Flights' | 'Countries';

export interface IWatchlist extends Document {
  userId: mongoose.Types.ObjectId;
  target: { kind: WatchTargetKind; id: mongoose.Types.ObjectId }; // dynamic ref
  title?: string;            // optional override for display
  labels?: string[];         // user tags: "honeymoon", "EAC", "budget"
  isMuted: boolean;          // user-level mute
  notifyOn: {
    // optional rules—use what you need for each target type:
    advisoryChange?: boolean;  // Countries (safety/advisory)
    docChange?: boolean;       // passport/visa rule changes
    priceDropPct?: number;     // Flights/Hotels (e.g., 10 = notify on ≥10% drop)
    daysBeforeStart?: number;  // Trips (reminders)
  };
  lastNotifiedAt?: Date;
  meta?: Record<string, any>; // free-form (e.g., airline code, fare class)
}

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
    target: {
      kind: { type: String, enum: ['Project', 'Trips', 'Places', 'Flights', 'Countries'], required: true },
      id: { type: Schema.Types.ObjectId, required: true, refPath: 'target.kind' }, // dynamic reference: target.kind
    },
    title: String,
    labels: { type: [String], default: [] },
    isMuted: { type: Boolean, default: false },
    notifyOn: {
      advisoryChange: { type: Boolean, default: false },
      docChange: { type: Boolean, default: false },
      priceDropPct: { type: Number, min: 0, max: 100 },
      daysBeforeStart: { type: Number, min: 0, max: 365 },
    },
    lastNotifiedAt: Date,
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Each user can only watch the same target once:
WatchlistSchema.index({ userId: 1, 'target.kind': 1, 'target.id': 1 }, { unique: true });

// Helpful query indexes by rule-type for cron jobs / triggers:
WatchlistSchema.index({ 'notifyOn.advisoryChange': 1 });
WatchlistSchema.index({ 'notifyOn.docChange': 1 });
WatchlistSchema.index({ 'notifyOn.priceDropPct': 1 });
WatchlistSchema.index({ 'notifyOn.daysBeforeStart': 1 });

export default mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
