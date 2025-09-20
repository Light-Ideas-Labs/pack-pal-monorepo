import mongoose, { Schema, Types } from 'mongoose';

export type Role = 'OWNER' | 'EDITOR' | 'VIEWER' | 'CONTRIBUTOR';
export type TripVisibility = 'private' | 'public' | 'friends';
export type TripColor = 'peach' | 'lavender' | 'mint' | 'sun' | 'ocean' | 'grape';

const TripCollaboratorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  role: { type: String, enum: ['OWNER', 'EDITOR', 'VIEWER', 'CONTRIBUTOR'], default: 'VIEWER' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { _id: false });

const TripDocumentSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: Number,
  mimeType: String
}, { _id: true, timestamps: true });

const PackingItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  checked: { type: Boolean, default: false },
  category: { type: String, default: 'general' }
}, { _id: true });

const UseOfFundsSchema = new Schema({
  category: String,
  percentage: { type: Number, min: 0, max: 100 }
}, { _id: false });

/** optional: a lightweight itinerary item */
const ItineraryItemSchema = new Schema({
  time: String,                  // "09:30"
  title: { type: String, required: true },
  description: String,
  location: String,
}, { _id: true, timestamps: true });

const TripSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
  title: { type: String, required: true },
  destination: { type: String },
  coverColor: { type: String, default: '#6b7280' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  documents: [TripDocumentSchema],
  packingItems: [PackingItemSchema],
  collaborations: [TripCollaboratorSchema],
  useOfFunds: [UseOfFundsSchema],
  visibility: { type: String, enum: ['private', 'public', 'friends'], default: 'private' },
  invites: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  itinerary: [ItineraryItemSchema],
  coverUrl: { type: String, default: null },
  placesCount: { type: Number, default: 0 }, // denormalized count of places if you want a quick pill on trip card
}, { timestamps: true, versionKey: false });

TripSchema.virtual('days').get(function () {
  if (!this.startDate || !this.endDate) return 0;
  const ms = Math.max(0, (new Date(this.endDate).setHours(0,0,0,0) - new Date(this.startDate).setHours(0,0,0,0)));
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
});

TripSchema.set('toJSON', { virtuals: true });
TripSchema.set('toObject', { virtuals: true });

export default mongoose.model('Trips', TripSchema);
